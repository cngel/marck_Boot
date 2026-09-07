document.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg && tg.expand) {
    try { tg.expand(); } catch (e) { /* ignore */ }
  }

  const employeeTable = document.querySelector('#employeesTable tbody');
  const salesTable = document.querySelector('#salesTable tbody');

  const state = {
    employees: [],
    sales: []
  };

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function getStatusClass(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized.includes('pago')) return 'status-paid';
    if (normalized.includes('pendente')) return 'status-pending';
    return 'status-cancelled';
  }

  function renderMetrics() {
    const totalEmployees = state.employees.length;
    const totalSales = state.sales.length;
    const totalRevenue = state.sales.reduce((sum, sale) => sum + Number(sale.value || 0), 0);
    const goal = 600000;

    document.getElementById('metric-employees').textContent = totalEmployees;
    document.getElementById('metric-sales').textContent = totalSales;
    document.getElementById('metric-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('metric-goal').textContent = formatCurrency(goal);
  }

  function renderEmployees(filterText = '') {
    const query = filterText.trim().toLowerCase();
    const filtered = state.employees.filter((employee) => {
      if (!query) return true;
      return [employee.name, employee.role, employee.department, employee.phone]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

    if (!filtered.length) {
      employeeTable.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhum funcionário encontrado.</td></tr>';
      return;
    }

    employeeTable.innerHTML = filtered.map((employee) => `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.role}</td>
        <td>${employee.department}</td>
        <td>${employee.phone}</td>
        <td>${formatCurrency(employee.salary)}</td>
      </tr>
    `).join('');
  }

  function renderSales() {
    if (!state.sales.length) {
      salesTable.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhuma venda registrada.</td></tr>';
      return;
    }

    salesTable.innerHTML = state.sales.map((sale) => `
      <tr>
        <td>${sale.client}</td>
        <td>${sale.product}</td>
        <td>${sale.employee}</td>
        <td>${formatCurrency(sale.value)}</td>
        <td><span class="status-pill ${getStatusClass(sale.status)}">${sale.status}</span></td>
      </tr>
    `).join('');
  }

  async function loadDashboard() {
    try {
      const [employeesResponse, salesResponse] = await Promise.all([
        fetch('/api/funcionarios'),
        fetch('/api/vendas')
      ]);

      const employeesData = await employeesResponse.json();
      const salesData = await salesResponse.json();

      state.employees = employeesData.data || [];
      state.sales = salesData.data || [];

      renderMetrics();
      renderEmployees();
      renderSales();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      employeeTable.innerHTML = '<tr><td colspan="5" class="empty-row">Não foi possível carregar os funcionários.</td></tr>';
      salesTable.innerHTML = '<tr><td colspan="5" class="empty-row">Não foi possível carregar as vendas.</td></tr>';
    }
  }

  async function submitEmployee(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      role: String(formData.get('role') || '').trim(),
      department: String(formData.get('department') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      salary: Number(formData.get('salary') || 0)
    };

    if (!payload.name || !payload.role || !payload.department || !payload.phone || !payload.salary) {
      alert('Preencha todos os campos corretamente para cadastrar o funcionário.');
      return;
    }

    try {
      const response = await fetch('/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao cadastrar funcionário.');
      }

      form.reset();
      await loadDashboard();

      if (tg && typeof tg.sendData === 'function') {
        tg.sendData(JSON.stringify({ action: 'funcionario_cadastrado', employee: data.data }));
      }
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      alert(error.message || 'Erro ao cadastrar o funcionário.');
    }
  }

  document.getElementById('employeeForm').addEventListener('submit', submitEmployee);
  document.getElementById('employeeSearch').addEventListener('input', (event) => {
    renderEmployees(event.target.value);
  });

  loadDashboard();
});
