function togglePassword(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);
  const iconPath = 'static/icons/';
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.querySelector('img').src = `${iconPath}eye-slash-solid.svg`;
  } else {
    passwordInput.type = 'password';
    eyeIcon.querySelector('img').src = `${iconPath}eye-solid.svg`;
  }
}

function toggleEnter(inputId) {
  const buttonCadastro = document.getElementById('btn-cadastro');
  const buttonEntrar = document.getElementById('btn-entrar');

  if (inputId === 'form-cadastro') {
    document.getElementById('form-login').style.display = 'none';
    document.getElementById('form-cadastro').style.display = 'flex';
    buttonCadastro.style.backgroundColor = 'var(--cor-bg)';
    buttonEntrar.style.backgroundColor = 'var(--cor-bgEscuro)';
  } else {
    document.getElementById('form-cadastro').style.display = 'none';
    document.getElementById('form-login').style.display = 'flex';
    buttonEntrar.style.backgroundColor = 'var(--cor-bg)';
    buttonCadastro.style.backgroundColor = 'var(--cor-bgEscuro)';
  }
}