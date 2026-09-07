// ...existing code...

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();

  // Dados do usuário logado no Telegram
  const user = tg.initDataUnsafe?.user || null;

  console.log('initData:', tg.initData);
  console.log('initDataUnsafe:', tg.initDataUnsafe);

  if (user) {
    console.log('Dados do usuário:', user);
    console.log('Telefone:', user.phone_number || 'Telefone não disponível no initData');
  } else {
    console.log('Nenhum usuário encontrado em initDataUnsafe.user');
  }
}

// Função para pegar os dados do usuário do Telegram
function pegarDadosUsuarioTelegram() {
  const user = tg?.initDataUnsafe?.user || null;

  if (!user) {
    return {
      id: null,
      nome: null,
      username: null,
      telefone: null
    };
  }

  return {
    id: user.id || null,
    nome: `${user.first_name || ''} ${user.last_name || ''}`.trim() || null,
    username: user.username || null,
    telefone: user.phone_number || null
  };
}

const dadosUsuario = pegarDadosUsuarioTelegram();
console.log('dadosUsuario:', dadosUsuario);

// renderizar os dados na tela
function renderDadosUsuarioTelegram() {
  const user = tg?.initDataUnsafe?.user || null;
  let container = document.getElementById('telegram-user-data');

  if (!container) {
    container = document.createElement('div');
    container.id = 'telegram-user-data';
    container.style.margin = '20px 0';
    container.style.padding = '12px 16px';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '8px';
    container.style.background = '#f9f9f9';
    container.style.fontFamily = 'Arial, sans-serif';
    document.body.prepend(container);
  }

  if (!user) {
    container.innerHTML = '<strong>Telegram:</strong> Usuário não encontrado.';
    return;
  }

  const nome = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Sem nome';
  const telefone = user.phone_number || 'Telefone não disponível';

  container.innerHTML = `
    <strong>Dados do usuário Telegram:</strong><br>
    <b>ID:</b> ${user.id || 'N/A'}<br>
    <b>Nome:</b> ${nome}<br>
    <b>Username:</b> ${user.username || 'N/A'}<br>
    <b>Telefone:</b> ${telefone}
  `;
}

renderDadosUsuarioTelegram();

// Exemplo mínimo de função procurar usada pelo botão
function procurar() {
  const prov = document.getElementById('provincia').value || '';
  const preco = document.getElementById('preco').value || '';
  const resultado = document.getElementById('resultado');

  resultado.textContent = `A procurar em "${prov}" com preço até ${preco}`;
}
