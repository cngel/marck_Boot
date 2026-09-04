const tg = window.Telegram.WebApp;

tg.ready();

console.log(tg.initData);
console.log(tg.initDataUnsafe);

// Exemplo mínimo de função procurar usada pelo botão
function procurar(){
  const prov = document.getElementById('provincia').value || '';
  const preco = document.getElementById('preco').value || '';
  const resultado = document.getElementById('resultado');
  resultado.textContent = `A procurar em "${prov}" com preço até ${preco}`;
}
