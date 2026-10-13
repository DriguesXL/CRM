import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Phone, Mail, Trash2, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingState } from '@/components/shared/LoadingState';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';
import { customersService } from '@/services/customers';
import { formatPhone, formatDate } from '@/lib/formatters';
import type { Customer } from '@/types';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersService.getCustomers({ search: search || undefined });
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await customersService.deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir cliente');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-sm text-slate-500">
            Gerencie sua carteira de clientes ativos e histórico de contratos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCustomer(null);
            setIsModalOpen(true);
          }}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por cliente, empresa ou documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Customers Table */}
      {loading ? (
        <LoadingState message="Carregando clientes..." />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Converta um lead ganho ou adicione clientes diretamente para gerenciar sua carteira."
          actionLabel="Cadastrar Primeiro Cliente"
          onAction={() => {
            setEditingCustomer(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Cliente / Razão Social</th>
                <th className="px-6 py-3.5">Contato</th>
                <th className="px-6 py-3.5">Documento</th>
                <th className="px-6 py-3.5">Gerente de Conta</th>
                <th className="px-6 py-3.5">Desde</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/customers/${c.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    {c.company && (
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <span>{c.company}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-xs">
                      {c.phone && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{formatPhone(c.phone)}</span>
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{c.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 font-mono">
                      {c.document || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-700">
                      {c.assigned_user?.full_name || 'Geral'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">{formatDate(c.created_at)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Excluir"
                        onClick={(e) => handleDelete(c.id, e)}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        initialData={editingCustomer}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSuccess={() => {
          fetchCustomers();
        }}
      />
    </div>
  );
};
