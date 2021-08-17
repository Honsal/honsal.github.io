---
layout: post
title: WSL2 방화벽 문제?
summary: 도대체 뭐가 문제야
categories: ["WSL", "Development"]
tags: ["WSL", "Firewall"]
comments: true
author: Honsal
---

제가 [이전 포스트](/development/wsl/wsl2-network-problem/)에서 작성한 방법대로 잘 써먹던 중, 어느 순간부터 다시 WSL2에서 인터넷이 안 되기 시작했습니다. 여전히 핑은 됐고 여타 포트들로 통신도 되지만 80포트, 443포트 등 필수 포트에 연결이 안 되는 증상이었죠.

더 최악은, 갑자기 IIS까지 작동을 안 하기 시작했다는 겁니다. 생각해보니 재부팅 한 뒤로부터 이런 것 같은데 문제는 제가 재부팅을 아무리 자주 해봐야 최소 3일에 한 번 정도밖에 안 한다는 것이죠.

## 원인 찾기

어쩌겠습니까. 최대한 기억을 더듬어서 재부팅 전에 제가 시스템에 뭘 했는지 찾아보는 수밖에요.

### IIS는 왜 갑자기 작동을 안 해?

일단 급한 불부터 끄기로 했습니다. IIS가 작동을 안 하는 문제에 대한 해결책을 우선 찾아야했습니다. 정확히 어떻게 작동을 안 하느냐 하면, IIS의 80포트, 443포트에 바인딩된 사이트가 윈도우 부팅 시부터 **중지** 상태로 있으며, 시작하려 해도 **다른 프로세스에서 파일을 사용 중**이라며 시작되지 않았습니다.

예전 같았으면 *파일은 옘병할 무슨 파일?* 이라며 삽질을 오지게 했겠으나, 지금까지의 경험 덕분에 여기서 말하는 *파일*이 *포트*라는 것을 깨닳을 수 있었습니다. 그래서 일단 어떤 프로세스가 80포트를 점유하고 있는지 알아보기 위해 터미널을 켰습니다. `grep`을 사용하기 위해 우분투 디스트로를 사용했습니다.

```bash
~$ netstat.exe -aon | grep :80
```

실행해보니 다음과 같은 결과가 뜨고, 어떤 PID가 해당 포트를 점유중인지 알 수 있었습니다.[^1]

![netstat](/assets/images/posts/20210817/WSL_FIREWALL/1.png)

해당 PID를 점유하는 프로세스가 뭔지 작업 관리자에서 찾아보니 *svchost.exe*. 어떤 서비스인지 알기 위해 우클릭 후 서비스 보기를 눌러보니 `iphlpsvc`가 잡히더군요.

해당 서비스가 뭔지 구글링해보니 포트포워딩에 관여하는 서비스라고 설명돼있었습니다. 그래서 생각했죠. **netsh**.

근 10년 전에 게리모드 서버를 운영하며 포트포워딩이 필요했던 때가 있어서 윈도우에서 포트포워딩을 했던 적이 있고, 그 때 사용했던 커맨드가 기억에 남아있어서 더이상 구글링 할 필요 없이 끝났습니다.

아무튼, 그래서 `netsh interface portproxy show all`로 확인해보니, *0.0.0.0:80, 0.0.0.0:443, 0.0.0.0:5000, ...` 등 특정 포트에 WSL IP가 바인딩 되어있더라고요. 그래서 `netsh interface portproxy reset`으로 다 날려버렸습니다.[^2]

이로써 IIS 작동 불가 문제는 해결!

### Avira 안티 바이러스의 방화벽 강제 작동

급한 불은 껐으니, 이제 처음에 계획한 대로 제가 재부팅 전에 무엇을 했는지 더듬어 올라갈 시간입니다. 그런데, 아무리 생각해도 크게 시스템을 건드린 것은 없었고 딱 하나, Avast가 윈도우 11에서 계속 UI를 보여주지 않는 버그 때문에 Avast를 제거하고 구독을 해제한 뒤 Avira Pro로 넘어온 일이 있었죠.

그리고 문득 떠올렸습니다. 아직 Avira UI가 지금처럼 (그나마)볼 만 하지 않았을 시절, 기본값으로 사용자의 방화벽을 계속 켜져있게 유지하는 설정이 들어있었다는 사실을.

아니나 다를까, 설정에 가보니 역시 켜져있더라고요. 그래서 다 꺼버렸습니다.

![Avira Settings](/assets/images/posts/20210817/WSL_FIREWALL/2.png)

그리고 재부팅을 하니[^3], 짜잔! 정상 작동!

## 문제는 해결됐다. 하지만 뭘까, 이 답답함은

문제는 해결됐습니다. 하지만 답답함이 남았습니다. 도대체 왜, 왜? 왜 다른 방화벽도 아니고 공용 프로필의 방화벽이 켜져있다고 WSL에서 인터넷이 안 되는 것일까!

궁금한 건 못 참죠. 바로 구글링에 들어갔습니다.

### WSL에서 통신을 위한 포트 설정

그리고 다음과 같은 스크립트를 찾았습니다.

```powershell
$remoteport = bash.exe -c "ip addr | grep eth0"
$found = $remoteport | Select-String -Pattern '((?:\d{1,3}\.){3}\d{1,3})';

if ( $found ) {
    $remoteport = $found.Matches.Groups[1].Value
}
else {
    Write-Output "The ip address of WSL 2 cannot be found. Script exited.";
    exit;
}

#[Ports]

#All the ports you want to forward separated by coma
$ports = @(80, 443, 10000, 3000, 5000);


#[Static ip]
#You can change the addr to your ip config to listen to a specific address
$addr = '0.0.0.0';

$tempAddr = Get-NetIPAddress -InterfaceAlias "이더넷 2" -AddressFamily IPv4

if (-Not $tempAddr) {
    Write-Output "Could not found network interface to connect with. Script exited."
    exit;
}

$addr = $tempAddr.IPAddress

$ports_a = $ports -join ",";


#Remove Firewall Exception Rules
iex "Remove-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' ";

#adding Exception Rules for inbound and outbound Rules
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort $ports_a -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort $ports_a -Action Allow -Protocol TCP";

for ( $i = 0; $i -lt $ports.length; $i++ ) {
    $port = $ports[$i];
    iex "netsh interface portproxy delete v4tov4 listenport=$port listenaddress=$addr";
    iex "netsh interface portproxy add v4tov4 listenport=$port listenaddress=$addr connectport=$port connectaddress=$remoteport";
}
```

해당 스크립트는 예전에도 한 번 본 기억이 있었는데, 언제인지는 기억이 나지 않습니다. 아마 WSL 인터넷이 안 되는 문제로 구글 검색 결과 순서를 외울 정도로 WSL 관련 글을 찾아다닐 때 봤겠죠. 그리고 예전에 본 적이 있는 글이라는 데서 예상하셨다시피, 이 글은 WSL에서 인터넷이 안 되는 증상을 해결하는 데 도움을 주는 글이었습니다.

제가 위 스크립트에서 중점적으로 본 것은 `New-NetFirewallRule` 부분입니다. 인바운드/아웃바운드 TCP 연결에 `80, 443, 3000, 5000, 10000` 포트를 허용하는 구문이죠. 여기서 알 수 있었던 점은, *80포트와 443포트**가 있는 것으로 봐서 WSL이 통신을 하려면 저 포트를 허용해야되겠거니... 하는 정도였습니다.

### 어라?

여기까지 하고 보니 문득 드는 생각. 바로 **이제는 WSL 인터넷 문제로 고민 할 일이 없어졌다**는 생각이었습니다.

여러개의 이더넷 어댑터, 심지어 VPN을 사용한다 하더라도 이전 글에서 소개한 인터페이스 메트릭 변경으로 해결할 수 있고, 이 글에 적힌 방화벽 문제까지 해결한다면 두 번 다시 WSL의 인터넷 문제로 골치를 썩일 일은 없다는 생각이 들었습니다.

어라? 하고 생각이 들 만큼, 근 1년이 넘도록 저를 괴롭혀오던 문제는 이렇게나 간단히 풀리게 되었습니다.

[^1]: 이 이미지는 현재 시점의 이미지라 4번 PID가 사용하고 있지만(IIS), 이전에는 6천번대의 프로세스였습니다. 일단 4번은 아니라는 겁니다.

[^2]: 저는 사전에 설정해놓은 다른 포트포워딩이 없었기 때문에 `reset`으로 날렸지만, 만약 다른 포트포워딩을 설정한 적이 있다면 잘 보시고 필요한 것만 `netsh interface portproxy remove v4tov4 ...` 커맨드로 지우셔야 합니다.

[^3]: 포트포워딩 변경 사항도 있고 해서 혹시 몰라 재부팅을 했습니다. 재부팅을 안 해도 되는지는 확인하지 않았으므로 여러분께서는 재부팅 하지 않고 일단 확인해보세요.
