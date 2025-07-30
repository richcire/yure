## 댓글 기능 리펙토링

### 파일 구조

xx-comment-section => CommentsRefactory => CommentRefactory => Reply

xx-comment-section : 댓글 기능을 사용하기 위한 제일 상위 파일

- ui/api (comment get/add/delete) 를 생성하는 파일

CommentsRefactory,CommentRefactory,Reply : 댓글/답글 기능을 세분화 해놓은 파일

- 따로 코드 수정 없이 CommentsRefactory를 import 하여 필요한 props 만 xx-comment-section에 넣어 넘겨주면 됨
