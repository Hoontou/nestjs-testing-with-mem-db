인메모리 디비로 유닛테스트 해보는 repo.

테스트 하기 좋은코드, 테스트하기 좋게 코드짜는 법
등등 기본지식은 어느정도 천천히 머리에 넣어왔다.
이전 sns 프로젝트에 적용해볼 까 했지만, db i/o가 대부분인 코드여서 망설였는데, 이번에 확실히 기본이 되는 코드를
짜서 시작하면 테스팅 적용하기 쉬울것임.

먼저,

1- jest 기본 사용법 뚝딱 다시 해보고,
https://github.com/Hoontou/jestHandling

2- docker로 몽고, pgdb 개발용으로 셋업하고,

3- pg-mem typeorm
mongodb-memory-server mongoose 테스트 용으로 셋업하고

4- 임의 스키마, 테이블 짠 후 테스트환경에서 전역에서 mock데이터 넣고
5- 각각 유닛테스트에서 잘 사용되는지,

6- 모의 개발 연습까지.

db를 테스트한다는게, 자원 많이먹는다는거 알지만, 해보고 말하는거랑 안해보고 말하는거랑은 큰 차이가 있을거임.
또 tdd의 흑백, 장단에 대해서도.

하나 내 주관으로 확실한건, 유닛테스트 할 시간에 리팩토링 해라. <-완전 맞는말이라는거.
근데 이것도 테스트 툴 숙련도, 어떤코드에 유닛테스트 해야하는가?,
테스트 하기 쉬운 코딩스타일, 등등 많은 요소에 의해서 좌우될 수 있다는걸 알고있다.

내 주관으로 평가하기 위해선, 일단 해봐야하지 않겠나.

그리고 이왕 하는거 제대로, 이때까지 머리에 집어넣은것들이 아깝지 않게.
