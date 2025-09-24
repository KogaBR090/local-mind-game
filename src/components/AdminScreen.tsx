import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface AdminScreenProps {
  questions: Question[];
  onAddQuestion: (question: Question) => void;
  onUpdateQuestion: (questionId: string, question: Question) => void;
  onRemoveQuestion: (questionId: string) => void;
  onBack: () => void;
}

export const AdminScreen = ({ 
  questions, 
  onAddQuestion, 
  onUpdateQuestion, 
  onRemoveQuestion, 
  onBack 
}: AdminScreenProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: 0
  });

  const resetForm = () => {
    setFormData({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: 0
    });
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (question: Question) => {
    setFormData({
      question: question.question,
      option1: question.options[0] || '',
      option2: question.options[1] || '',
      option3: question.options[2] || '',
      option4: question.options[3] || '',
      correctAnswer: question.correctAnswer
    });
    setEditingId(question.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleSave = () => {
    const { question, option1, option2, option3, option4, correctAnswer } = formData;
    
    if (!question.trim() || !option1.trim() || !option2.trim() || !option3.trim() || !option4.trim()) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    const questionData: Question = {
      id: editingId || Date.now().toString(),
      question: question.trim(),
      options: [option1.trim(), option2.trim(), option3.trim(), option4.trim()],
      correctAnswer,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      onUpdateQuestion(editingId, questionData);
    } else {
      onAddQuestion(questionData);
    }

    handleCancel();
  };

  const handleDelete = (questionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta questão?')) {
      onRemoveQuestion(questionId);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Administração de Questões</h1>
            <p className="text-muted-foreground">
              Total de questões: {questions.length}
            </p>
          </div>
          <Button onClick={onBack} variant="outline">
            Voltar ao Menu
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Editar Questão' : 'Nova Questão'}
              </CardTitle>
              <CardDescription>
                Preencha todos os campos e selecione a resposta correta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Pergunta</label>
                <Textarea
                  placeholder="Digite a pergunta..."
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num}>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Opção {num}
                      {formData.correctAnswer === num - 1 && (
                        <Badge variant="default" className="text-xs">Correta</Badge>
                      )}
                    </label>
                    <Input
                      placeholder={`Digite a opção ${num}...`}
                      value={formData[`option${num}` as keyof typeof formData]}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        [`option${num}`]: e.target.value 
                      }))}
                    />
                    <Button
                      type="button"
                      variant={formData.correctAnswer === num - 1 ? "default" : "outline"}
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => setFormData(prev => ({ ...prev, correctAnswer: num - 1 }))}
                    >
                      {formData.correctAnswer === num - 1 ? 'Resposta Correta' : 'Marcar como correta'}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAdding && !editingId && (
          <Button onClick={handleStartAdd} className="mb-6">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Nova Questão
          </Button>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhuma questão cadastrada. Adicione sua primeira questão!
                </p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Questão {index + 1}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {question.question}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStartEdit(question)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(question.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded border text-sm ${
                          optionIndex === question.correctAnswer
                            ? 'bg-accent/10 border-accent text-accent-foreground font-medium'
                            : 'bg-muted/50'
                        }`}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + optionIndex)})
                        </span>{' '}
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};