function togglePassword(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);
  const iconPath = 'static/icons/'; // Altere para seu caminho correto

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.querySelector('img').src = `${iconPath}eye-slash-solid.svg`; // Ícone olho fechado
  } else {
    passwordInput.type = 'password';
    eyeIcon.querySelector('img').src = `${iconPath}eye-solid.svg`; // Ícone olho aberto
  }
}

function toggleEnter(inputId) {
  const buttonCadastro = document.getElementById('button-cadastro');
  const buttonEntrar = document.getElementById('button-entrar');

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
