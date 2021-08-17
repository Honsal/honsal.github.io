---
layout: post
title: WSL2 ping은 먹는데 인터넷은 안 된다?
author: Honsal
date: 2021-08-14 10:16:05 +09:00
categories: ["Development", "WSL"]
tags: ["WSL", "Development"]
comments: true
---

WSL2가 나온 직후부터 저를 계속해서 괴롭혀오던 문제가 있습니다. 바로 Hyper-V에서 새 가상 스위치를 추가하는 시점부터 WSL이 제대로 작동하지 않는다는 것이죠.

정말 가능한 모든 경우의 키워드를 들고 스택오버플로우, 깃헙 이슈 페이지, MSDN, 마소 서포트 센터 등 오만 곳을 다 돌아다녔으나 해결하지 못했습니다.

## 핑은 되는데 인터넷은 안 된다?

그러다가 어느 순간 핑이 되기 시작했습니다. 아마 Interface Metric을 조정했을 때였던 것으로 기억합니다. 핑이 비허용되지 않은 어떤 곳에도 핑을 날릴 수 있었습니다.[^1]

### Name Resolution

그러나 여전히 도메인 URL에 대한 핑은 안 됐었는데, 이건 `/etc/wsl.conf`에 아래와 같은 사항을 등록한 뒤,

```bash
[network]
generateResolvConf = false
```

`/etc/resolv.conf`를 우선 지우고

```bash
~$ sudo rm /etc/resolv.conf
```

`/etc/resolv.conf`에 네임서버를 추가한 뒤

```bash
~$ sudo vim /etc/resolv.conf

# /etc/resolv.conf 내용
#
# nameserver 8.8.8.8
# nameserver 1.1.1.1
```

WSL이 시작할 때마다 resolv.conf를 삭제하거나 덮어쓰는 것을 방지하기 위해 읽기 전용 속성을 `/etc/resolv.conf`에 할당했습니다.

```bash
~$ sudo chattr +i /etc/resolv.conf
```

### 여전히 인터넷은 불가

그러나 여전히 인터넷은 불가능했죠. IP로 핑을 날리던 게 이제 `ping google.com`과 같이 도메인으로 날릴 수 있게 되었다는 차이 뿐이었습니다.

## 미쳐버릴 노릇

저한테 이런 현상은 그야말로 미쳐버릴 노릇이었습니다. 사설 GitLab을 운영중이기 때문에 Docker를 지울 수 없었고, 개발 상의 이유로 Hyper-V의 가상 스위치를 제거할 수도 없었으며, 마찬가지의 이유로 WSL[^2]도 자주 들락날락해야 했는데 우분투에다가 뭐를 설치하려고 apt 명령어를 사용하려 할 때마다 인터넷이 안 되니 아무것도 안 되고, 그 때마다 윈도우에서 패키지를 받아 직접 설치하는 작업은 그야말로 고통 그 자체였습니다.

### 계속된 실패

처음 이 문제가 발생했을 때는 WSL 2가 나온지 얼마 안 된 상태였으니 그러려니 하고 언젠가 방법이 나오겠지 하고 넘어갔습니다.

그러나 패키지를 설치할 때마다 밀려오는 귀차니즘에 한 달에도 몇 번씩 관련 문제에 새로운 해결 방법이 나왔나 구글링을 하다 보니 어느샌가 어떤 키워드로 검색하면 어떤 포스트가 몇번째에 있고 거기에 적혀있는 해결 방법은 뭔지 외워버리는 지경에까지 도달했습니다.

#### 반짝였던 솔루션

그 중에는 작동했던 솔루션도 있습니다. 바로 호스트 어댑터의 연결을 WSL에 공유하고, WSL에서 `ip addr` 및 `route` 명령을 통해 해당 공유된 연결의 IP를 사용하도록 설정하는 것이었죠.

그러나 Windows 11로 넘어오면서 `WSL` 어댑터가 공유 가능 목록에 나타나질 않는 바람에 이것도 물거품이 됐습니다.

## 원인 파악

그리고 오늘, 원인이 몰까 다시 한 번 진지하게 고민하기 시작했습니다. 관련 키워드로 구글에 검색을 할 때마다 보이는 VPN 관련 문제 때문에 지속적으로 구글에 `-Cisco -VPN`을 추가하며 검색하고 있었는데, 문득 스쳐 지나가는 아이디어가 있었습니다.

### 다중 NIC

저는 메인보드에서 기본적으로 두 개의 네트워크 어댑터를 지원합니다. 하나는 인텔이고, 하나는 아콘입니다. 두 개 모두 인터넷에 연결된 상태이며, 10Gbps를 지원하는 아콘을 주력으로 사용하고 있습니다.

가만 생각해보니, VPN을 사용할 때에도 네트워크 어댑터[^3]가 추가된다는 것을 떠올리게 됐습니다. 그리고 앞서 말씀드렸다 시피 이런 증상으로 구글링하면 항상 VPN 관련 문제가 상위에 랭크되었죠.

그리고 핑이 날려지기 시작한 시점이 Interface Metric을 조정한 시점이라는 것이 떠올라 생각이 뒤섞이기 시작하면서, 빛이 보이기 시작했습니다.

#### 우선 랜카드를 하나만 써보자

그리고 제가 선택한 것은 인텔 NIC을 비활성화 하는 것이었습니다. 랜선을 먼저 뽑을까 생각해봤지만, 의미 없는 행동인 것 같아서 랜선은 꼽힌 채로 두고 비활성화만 진행했습니다.

결과는? **대성공.** 우분투에서 문제없이 인터넷에 연결되었습니다. 테스트는 `wget` 명령어를 사용해 아무 웹 사이트나 내려받는 것이었고, 정상적으로 작동했습니다.

> 주의
>
> 이 단계에서 제가 '하나만 남겼다'는 NIC는 물리적 NIC를 말합니다. Hyper-V 가상 어댑터는 모두 평소와 같이 세팅되어 있는 상태였습니다. 즉, 랜카드 두 개 중 하나를 비활성화 한 시점에서 Hyper-V 가상 스위치와 관계없이 WSL에서 인터넷을 사용할 수 있게 되었다는 말입니다.

하지만 여기서 끝낼 수는 없었죠. 저는 두 개의 랜카드를 모두 써야 하니까요.

## 최종 솔루션

그래서 제가 선택한 방법은 Interface Metric을 조정하는 것이었습니다. 지금 생각하면 도대체 왜 그랬는지 모르겠으나, 제가 핑이 되게할 때 조정한 메트릭은 vEthernet쪽이었고, 실제 물리 네트워크 인터페이스의 메트릭은 거의 건드리지 않았습니다[^4].

하지만 이제는 어떻게 해야 하는지 감이 잡혔습니다. 다른 게 아니라, 자주 사용하지 않는 NIC의 메트릭을 최하위로 내려버리면 될 것 같았습니다.

```powershell
PS C:\Users\Administrator> Get-NetIPInterface

ifIndex InterfaceAlias                  AddressFamily NlMtu(Bytes) InterfaceMetric Dhcp     ConnectionState PolicyStore
------- --------------                  ------------- ------------ --------------- ----     --------------- -----------
24      vEthernet (External)            IPv6                  1500              25 Enabled  Connected       ActiveStore
13      vEthernet (Internal)            IPv6                  1500              15 Enabled  Connected       ActiveStore
31      vEthernet (WSL)                 IPv6                  1500            5000 Enabled  Connected       ActiveStore
22      vEthernet (Default Switch)      IPv6                  1500            5000 Enabled  Connected       ActiveStore
7       이더넷 2                        IPv6                  1500              25 Enabled  Connected       ActiveStore
1       Loopback Pseudo-Interface 1     IPv6            4294967295              75 Disabled Connected       ActiveStore
24      vEthernet (External)            IPv4                  1500              25 Enabled  Connected       ActiveStore
13      vEthernet (Internal)            IPv4                  1500              15 Enabled  Connected       ActiveStore
31      vEthernet (WSL)                 IPv4                  1500            5000 Disabled Connected       ActiveStore
22      vEthernet (Default Switch)      IPv4                  1500            5000 Disabled Connected       ActiveStore
7       이더넷 2                        IPv4                  1500              25 Enabled  Connected       ActiveStore
1       Loopback Pseudo-Interface 1     IPv4            4294967295              75 Disabled Connected       ActiveStore

PS C:\Users\Administrator>
```

*이더넷 2*가 인텔 NIC이고, 원래 있어야 할 아콘의 *이더넷*은 현재 가상 스위치 *vEthernet (External)*이 설정되는 과정에서 없어진 상태입니다. 때문에 저는 아콘을 메인 연결로 사용하기 위해 *vEthernet (External)*의 메트릭을 사라지기 전 *이더넷*과 같은 25로 올려놓은 상태이죠.

아무튼, 이제 *이더넷 2*의 메트릭을 최하위로 내려버릴 시간입니다. `Get-NetIPInterface`에서 확인한 *이더넷 2*의 ifindex는 7이니 조정해봅시다.

```powershell
PS C:\Users\Administrator> Set-NetIPInterface -InterfaceMetric 9000 -ifIndex 7
PS C:\Users\Administrator> Get-NetIPInterface

ifIndex InterfaceAlias                  AddressFamily NlMtu(Bytes) InterfaceMetric Dhcp     ConnectionState PolicyStore
------- --------------                  ------------- ------------ --------------- ----     --------------- -----------
24      vEthernet (External)            IPv6                  1500              25 Enabled  Connected       ActiveStore
13      vEthernet (Internal)            IPv6                  1500              15 Enabled  Connected       ActiveStore
31      vEthernet (WSL)                 IPv6                  1500            5000 Enabled  Connected       ActiveStore
22      vEthernet (Default Switch)      IPv6                  1500            5000 Enabled  Connected       ActiveStore
7       이더넷 2                        IPv6                  1500            9000 Enabled  Connected       ActiveStore
1       Loopback Pseudo-Interface 1     IPv6            4294967295              75 Disabled Connected       ActiveStore
24      vEthernet (External)            IPv4                  1500              25 Enabled  Connected       ActiveStore
13      vEthernet (Internal)            IPv4                  1500              15 Enabled  Connected       ActiveStore
31      vEthernet (WSL)                 IPv4                  1500            5000 Disabled Connected       ActiveStore
22      vEthernet (Default Switch)      IPv4                  1500            5000 Disabled Connected       ActiveStore
7       이더넷 2                        IPv4                  1500            9000 Enabled  Connected       ActiveStore
1       Loopback Pseudo-Interface 1     IPv4            4294967295              75 Disabled Connected       ActiveStore

PS C:\Users\Administrator>
```

성공적으로 조정되었습니다. 혹시 몰라 `wsl --shutdown` 및 `Stop-Service LxssManager`, `RestartService LxssManager` 명령어로 확실하게 재시작해주었습니다.[^5]

결과는?

![성공](/assets/images/posts/20210814/WSL/1.png)

당연히 성공이죠! 성공 안 했으면 이 긴 글을 왜 쓰고 있겠어요.

정리
---

정리하자면, WSL의 버그인지 뭔진 모르겠으나 인터넷에 연결 된 NIC가 두 개 이상일 때 충돌이 발생하는 것 같습니다. 가장 간단한 방법은 인터넷에 연결된 NIC[^6]를 한 개만 남기고 비활성화 하는 것이고, 그게 힘든 상황이라면 위와 같이 **Interface Metric**을 조정해 **인터넷에 주로 연결하는 하나를 제외하고 vEthernet (WSL)보다 뒤로 날려버리는 것**입니다.

[^1]: 168.126.63.1, 8.8.8.8, ...

[^2]: 주로 Ubuntu distro

[^3]: 가상 어댑터

[^4]: 건드린다고 해도 아콘 NIC의 메트릭을 최상위로 올리는 정도였죠.

[^5]: 이것 떄문에 된 게 아닌가 하고 생각하실 수도 있지만, 당연히 이전에 다양한 조합으로 어마무시하게 많이 시도했던 명령들입니다. 모두 의미가 없었고요.

[^6]: VPN의 가상 어댑터든 물리적 어댑터든 상관없습니다.