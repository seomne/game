const $button = document.querySelector("button");
const $input = document.querySelector("input");
const $word = document.querySelector("#word");
const $message = document.querySelector("#message");
let word; //제시어
let newword; //현재 단어

const onClickButton = () => {
  if (!word || word[word.length - 1] === newword[0]) {
    //제시어가 비어 있거나 입력한 단어가 올바른가
    word = newword; //입력한 단어가 제시어가 된다
    $word.textContent = word; //화면에 제시어 표시
    $message.textContent = '';
  } else {
    $message.textContent = `RETRY😥 단어를 다시 확인해보세요.`
    $message.classList.add('error');
  }
  $input.value = "";
  $input.focus();
};

const onInput = (event) => {
  newword = event.target.value; //입력한 단어를 현재 단어로 지정
};

$button.addEventListener("click", onClickButton);
$input.addEventListener("input", onInput);
