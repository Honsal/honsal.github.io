---
bg: "posts/20210813/FOOTNOTE.png"
layout: post
title: "지킬용 말풍선 각주 플러그인 제작"
crawlertitle: "Jekyll용 footote balloon 제작"
date: 2021-08-13 11:02:37 +09:00
categories: "Blogging"
tags: ["Blogging", "Javascript", "Development"]
summary: 나무위키?
author: Honsal
comments: true
---

저는 아주 어렸을 때부터 신기술이라면 발광을 하며 쫓아다니는 타입이었습니다. 성인이 된지 한참 지난 지금에서야 그게 독이 될 때도 있다는 것을 깨닫고 있지만 그 때는 그런 건 제 알 바가 아니었죠.

첫 블로그를 텍스트큐브로 시작할 때도 마찬가지였습니다. 마침 블로그를 시작하기 위해 플랫폼을 선택할 때 참고한 블로그에서 말풍선 각주 기능을 사용하고 있었기에, 저도 이걸 적용했었죠.

다른 블로그 플랫폼으로 이사할 때도 항상 이러한 기능을 사용할 수 있는지가 고려 대상이었습니다. 티스토리로 이주했을 때에도, 블로그스팟[^1]으로 이주했을 때에도요.

### Jekyll

그리고 지금, 지킬로 이주했습니다. 지킬은 하나부터 열까지 스스로 할 필요가 있더군요. 오히려 좋습니다.

물론 처음에는 만들기가 귀찮아서 이것저것 찾아보다가 [bigfootjs](http://www.bigfootjs.com/)라는 것을 사용하려 했으나, 너무 오래전에 업데이트가 중단 된 것은 둘째치고 jQuery 버전이 너무 낮아 앞으로 jQuery를 사용해 이것 저것 구현하려 한다면 걸림돌이 될 것 같다 생각하여 패스했습니다.

### 직접 제작

결국 답은 직접 제작밖에 없었습니다. 생각해보니 이제는 CSS3도 있고 자바스크립트 ES6도 웬만한 브라우저에서 다 지원해주니 그렇게 어렵지 않게 만들 수 있을 것 같았습니다.

결과는? 어렵긴 커녕 너무나도 쉬워서 하품이 나올 정도였습니다. **시작이 반이다**는 말은 언제 어디서나 들어맞는 것 같더라고요. 10분도 채 안 되어 완성했습니다.

## 코드

### 자바스크립트 코드 (footnote-balloon.js)

```js
const TIMEOUT_SHOW_FN = 180;
const DURATION_FADE = 45;
const DURATION_FADEOUT = 120;

let latestFootnoteTimeoutID = -1;

let dialogFootnote = null;

/* eslint-disable no-undef */
$(document).ready(function() {
    let footnotes = $('a[href^=\\#fn\\:]');

    footnotes.each(function() {
        let id = /#fn:(\d+)$/ig.exec(this.href)[1];

        let liPair = $('#fn\\:' + id + ' > p');

        let fn = $(this);

        fn.mouseover(function() {
            latestFootnoteTimeoutID = setTimeout(() => {
                let offset = fn.offset();
                
                dialogFootnote = $('<div>');

                dialogFootnote.addClass('fn');

                let liText = liPair.text();

                dialogFootnote.text(liText.substring(0, liText.length - 2));

                $('body').append(dialogFootnote);

                dialogFootnote.offset({left: offset.left, top: offset.top + fn.height()});

                dialogFootnote.fadeIn(DURATION_FADE);

            }, TIMEOUT_SHOW_FN);
        });

        fn.mouseout(function() {
            clearTimeout(latestFootnoteTimeoutID);

            if (!dialogFootnote)
                return;

            let int = -1;

            int = setInterval(() => {     
                if ($('div.fn:hover').length > 0)
                    return;

                try {
                    dialogFootnote.fadeOut({
                        duration: DURATION_FADEOUT,
                        complete: () => {
                            dialogFootnote.remove();
                            dialogFootnote = null;
                        }
                    }, () => clearInterval(int));
                } catch (e) {
                    clearInterval(int);
                }
            }, 100);
        });
    });
});
```

나중에 혹시라도 페이드 인/아웃 딜레이, 마우스오버시 표시되는 딜레이 등을 변경할 일이 생길까봐 const로 선언해놨습니다.

특히, 마우스가 말풍선에 올라가 있는 동안에는 말풍선이 사라지지 않도록 처리했습니다.

지금 글을 쓰면서 보니 아직 다뤄야 할 게 많네요. 예를 들어 지금 버전에서는 **말풍선이 뷰포트 밖으로 나가는 경우에 대한 예외처리가 되어있지 않습니다.**

### SCSS (_footnote-balloon.scss)

```scss
div.fn {
    box-sizing: content-box;

    display: none;

    position: absolute;
    min-width: 16px;
    max-width: 400px;
    min-height: 20px;

    margin: 0;
    padding: 8px 10px;

    border-radius: 8px;

    color: rgba(240, 240, 240, 1);

    font-size: 14px;
    line-height: 1.5em;

    background: rgba(0, 0, 0, 0.85);

    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
}
```

초 간단 SCSS입니다. 모서리가 둥근 반투명 검은색 말풍선과 흰색 글자를 표시합니다. line-height는 1.5em으로 정했습니다. 이게 가장 보기 좋더라고요.

### 적용 (Voyager)

테마마다 적용 방식이 다를 수 있습니다. 제 경우에는 보이저 테마를 사용하고 있으므로 다음과 같이 적용했습니다.

1. Javascript/SCSS 파일을 각각 */assets/js*, */assets/_sass* 폴더에 생성
2. */assets/css/main.scss*에서 *footnote-ballooon* 을 임포트
3. */_includes/head.html*에서 *footnote-balloon.js*를 로드[^2]
4. 끝!

JS도 CSS도 별로 복잡하지 않기 때문에 어떤 테마에서든지 간편히 적용하시면 될 것 같습니다.

#### 다운로드

다운로드는 제 [블로그 깃헙 리포지토리](https://github.com/honsal/honsal.github.io)에서 하시면 됩니다. *assets* 폴더 하위에 있습니다.

마치며
---

이제 슬슬 위에서 언급한 문제를 해결해야겠네요. 뷰포트를 넘어갈 때 뷰포트 안에 항상 머물게 만들어야겠습니다.

[^1]: 현재 [블로거](https://www.blogger.com/)

[^2]: \<script type="text/javascript" src="{{ site.baseurl }}/assets/js/footnote-balloon.js">\</script\>
