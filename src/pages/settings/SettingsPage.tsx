import React, { useState, useEffect } from 'react';
import { Building2, Kanban, Tag as TagIcon, Globe, Plus, Trash2, Check, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { pipelineStagesService } from '@/services/pipelineStages';
import { sourcesService } from '@/services/sources';
import { tagsService } from '@/services/tags';
import { LocalStore } from '@/services/storage';
import type { PipelineStage, LeadSource, Tag } from '@/types';

export const SettingsPage: React.FC = () => {
  const { organization, resetAllData } = useAuth();

  // Company tab
  const [orgName, setOrgName] = useState(organization?.name || 'Minha Empresa');
  const [orgPhone, setOrgPhone] = useState(organization?.phone || '');
  const [orgEmail, setOrgEmail] = useState(organization?.email || '');
  const [orgAddress, setOrgAddress] = useState(organization?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Pipeline tab
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [newStageName, setNewStageName] = useState('');

  // Sources tab
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [newSourceName, setNewSourceName] = useState('');

  // Tags tab
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');

  useEffect(() => {
    pipelineStagesService.getStages().then(setStages);
    sourcesService.getSources().then(setSources);
    tagsService.getTags().then(setTags);
    if (organization) {
      setOrgName(organization.name || '');
      setOrgPhone(organization.phone || '');
      setOrgEmail(organization.email || '');
      setOrgAddress(organization.address || '');
    }
  }, [organization]);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (organization) {
      LocalStore.setOrganization({
        ...organization,
        name: orgName,
        phone: orgPhone || null,
        email: orgEmail || null,
        address: orgAddress || null,
        updated_at: new Date().toISOString(),
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    const created = await pipelineStagesService.createStage({ name: newStageName });
    setStages([...stages, created]);
    setNewStageName('');
  };

  const handleDeleteStage = async (id: string) => {
    if (!confirm('Excluir esta etapa?')) return;
    await pipelineStagesService.deleteStage(id);
    setStages(stages.filter((s) => s.id !== id));
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    const created = await sourcesService.createSource(newSourceName);
    setSources([...sources, created]);
    setNewSourceName('');
  };

  const handleDeleteSource = async (id: string) => {
    await sourcesService.deleteSource(id);
    setSources(sources.filter((s) => s.id !== id));
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const created = await tagsService.createTag(newTagName, newTagColor);
    setTags([...tags, created]);
    setNewTagName('');
  };

  const handleDeleteTag = async (id: string) => {
    await tagsService.deleteTag(id);
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        <p className="text-sm text-slate-500">
          Personalize as preferências da sua empresa, etapas de venda, origens e tags.
        </p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
          <TabsTrigger value="company" className="gap-2 text-xs">
            <Building2 className="h-3.5 w-3.5" />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2 text-xs">
            <Kanban className="h-3.5 w-3.5" />
            <span>Etapas do Funil</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2 text-xs">
            <Globe className="h-3.5 w-3.5" />
            <span>Origens de Lead</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2 text-xs">
            <TagIcon className="h-3.5 w-3.5" />
            <span>Tags & Marcadores</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da Organização</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Nome da Empresa</label>
                  <Input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Telefone Comercial</label>
                    <Input
                      value={orgPhone}
                      onChange={(e) => setOrgPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">E-mail de Contato</label>
                    <Input
                      type="email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Endereço</label>
                  <Input
                    value={orgAddress}
                    onChange={(e) => setOrgAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">Plano Comercial Ativo</Badge>
                    <span className="text-xs text-slate-400">Usuários e leads ilimitados</span>
                  </div>
                  <Button type="submit" className="gap-1.5 shadow-xs">
                    {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 border-red-200 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-base text-red-900">Limpeza Geral de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 mb-4">
                Se você deseja resetar qualquer dado antigo do cache e começar o CRM 100% limpo com zero leads, clientes ou tarefas, use o botão abaixo:
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Deseja limpar todos os dados em cache e iniciar o CRM 100% zerado em branco?')) {
                    resetAllData();
                  }
                }}
              >
                Limpar Cache e Iniciar Zerado em Branco
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Stages */}
        <TabsContent value="pipeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Etapas do Funil de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddStage} className="flex gap-2">
                <Input
                  placeholder="Nome da nova etapa..."
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                />
                <Button type="submit" className="gap-1 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Etapa</span>
                </Button>
              </form>

              <div className="space-y-2 pt-2">
                {stages.map((st, idx) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: st.color || '#3b82f6' }}
                      />
                      <span className="text-sm font-semibold text-slate-800">{st.name}</span>
                      {st.is_won && <Badge variant="success">Etapa de Fechamento Ganho</Badge>}
                      {st.is_lost && <Badge variant="destructive">Etapa de Perdido</Badge>}
                    </div>
                    {!st.is_won && !st.is_lost && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStage(st.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources */}
        <TabsContent value="sources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Canais de Origem dos Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddSource} className="flex gap-2">
                <Input
                  placeholder="Ex: Anúncio TikTok, Evento SP Tech..."
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                />
                <Button type="submit" className="gap-1 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Origem</span>
                </Button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {sources.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                  >
                    <span>{s.name}</span>
                    <button
                      onClick={() => handleDeleteSource(s.id)}
                      className="text-slate-300 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags */}
        <TabsContent value="tags" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags e Marcadores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddTag} className="flex gap-2">
                <Input
                  placeholder="Nome do marcador (ex: VIP, Urgente)..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="h-9 w-12 rounded-md border border-slate-200 p-1 cursor-pointer"
                />
                <Button type="submit" className="gap-1 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Tag</span>
                </Button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
                    style={{
                      borderColor: t.color,
                      color: t.color,
                      backgroundColor: `${t.color}15`,
                    }}
                  >
                    <span>{t.name}</span>
                    <button
                      onClick={() => handleDeleteTag(t.id)}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
