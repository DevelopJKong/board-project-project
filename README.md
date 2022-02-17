# node.js 토이 프로젝트 시작
    node.js와 mongodb를 사용해서 게시판을 만들어보려고 합니다

## 기술 스택
    1. 백엔드 => node.js
    2. 프론트엔드 => vailla javascript
    3. 디비 => mongodb
    4. 배포 => heroku

## API 설계
<hr>

[exception]
1. / -> home
2. /join -> Join
3. /login -> Login
4. /search -> Search

<hr>

[user]
1. /users/:id -> See Users
2. /users/edit -> Edit Users
3. /users/delete -> Delete Users
4. /users/logout -> Log out

[board]
1. /board/:id -> See Board
2. /board/:id/edit -> Edit Board
3. /board/:id/delete -> Delete Board
4. /board/write -> Write Board


### 진행여부
* 2022.01.31
    - 프로젝트 시작 => npm init & init.js로 서버 열기
* 2022.02.01
    - api 설계 완료
* 2022.02.02
    - router 문제 수정 및 bootstrap 적용
* 2022.02.04
    - carousel 문제 수정 , login page 완료
* 2022.02.06
    - mixin 만들기, 가짜 데이터 생성, watch page 및 edit page 완료
* 2022.02.07
    - schema, model 생성 및 watch page => write page 로 수정
* 2022.02.09
    - edit page & watch page & 스키마 수정 & edit,watch,delete 기능 구현, card 수정,404 페이지 구
현 02.09 완료
* 2022.02.13
    - 네이버 소셜 로그인 구현 중 (네이버 api 정보만 가지고 오면 완성 & 보완 필요 => 다른것 구현 완료 후 돌아올것)
* 2022.02.14
    - 네이버 소셜 로그인 완료
* 2022.02.15
    - multer 적용 완료
* 2022.02.17
    - heroku 배포 완료 [프로젝트 마무리 준비중]