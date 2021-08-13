---
bg: "posts/20210813/FOOTNOTE.png"
layout: post
title: "말풍선 각주 오버플로우 문제 픽스"
categories: Blogging
tags: ["Blogging", "Javascript", "Development"]
author: "Honsal"
comments: true
date: 2021-08-13 12:31:18 +09:00
---

이전 포스트에서 예고한 말풍선 각주의 너비 오버플로우 문제를 픽스했습니다.

```js
let right = offset.left + dialogFootnote.outerWidth();

let viewportWidth = document.documentElement.clientWidth || window.innerWidth;

if (right > viewportWidth)
    offset.left = Math.max(0, offset.left - (offset.left + dialogFootnote.outerWidth() - viewportWidth));
```

위와 같은 코드를 삽입함으로써 이제 정상 작동하게 됐습니다.

물론, 누군가가 말풍선의 최소 너비를 미친듯이 늘린다면 여전히 오버플로우가 되겠으나, 저는 그럴 일이 없으므로 이대로 커밋합니다.

관련 포스트: [지킬용 말풍선 각주 플러그인 제작]({{ site.baseurl }}/blogging/making-footnote-balloon)