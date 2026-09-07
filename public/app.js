const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();

  // Dados do usuário logados no Telegram
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

// Função para pegar os dados do usuário do Telegram e mostrar o número se estiver disponível
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

// Exemplo mínimo de função procurar usada pelo botão
function procurar(){
  const prov = document.getElementById('provincia').value || '';
  const preco = document.getElementById('preco').value || '';
  const resultado = document.getElementById('resultado');
  resultado.textContent = `A procurar em "${prov}" com preço até ${preco}`;
}
