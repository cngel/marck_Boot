const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, 'public');
const telegramWebAppDir = path.join(publicDir, 'telegram-webapp');

const funcionarios = [
  { id: 1, name: 'Ana Silva', role: 'Vendedor', department: 'Vendas', phone: '+244 923 000 001', salary: 85000 },
  { id: 2, name: 'Bruno Costa', role: 'Supervisor', department: 'Operações', phone: '+244 912 000 002', salary: 120000 },
  { id: 3, name: 'Carla Mendes', role: 'Atendimento', department: 'Suporte', phone: '+244 911 000 003', salary: 70000 }
];

const vendas = [
  { id: 1, client: 'Empresa A', product: 'Plano Premium', employee: 'Ana Silva', value: 120000, status: 'Pago' },
  { id: 2, client: 'Loja Beta', product: 'Sistema CRM', employee: 'Bruno Costa', value: 250000, status: 'Pendente' },
  { id: 3, client: 'Grupo Delta', product: 'Consultoria', employee: 'Carla Mendes', value: 98000, status: 'Pago' }
];

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(telegramWebAppDir, 'index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/api/funcionarios', (req, res) => {
  res.json({ success: true, data: funcionarios });
});

app.get('/api/vendas', (req, res) => {
  res.json({ success: true, data: vendas });
});

app.get('/api/dashboard', (req, res) => {
  const totalRevenue = vendas.reduce((sum, sale) => sum + Number(sale.value || 0), 0);

  res.json({
    success: true,
    data: {
      employees: funcionarios.length,
      sales: vendas.length,
      revenue: totalRevenue,
      goal: 600000
    }
  });
});

app.post('/api/funcionarios', (req, res) => {
  const { name, role, department, phone, salary } = req.body || {};

  if (!name || !role || !department || !phone || !salary) {
    return res.status(400).json({ success: false, message: 'Preencha todos os campos do funcionário.' });
  }

  const novoFuncionario = {
    id: Date.now(),
    name: String(name).trim(),
    role: String(role).trim(),
    department: String(department).trim(),
    phone: String(phone).trim(),
    salary: Number(salary)
  };

  funcionarios.push(novoFuncionario);

  res.status(201).json({ success: true, message: 'Funcionário cadastrado com sucesso.', data: novoFuncionario });
});

app.use('/telegram-webapp', express.static(telegramWebAppDir));
app.use(express.static(publicDir));

app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.sendFile(path.join(telegramWebAppDir, 'index.html'));
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});