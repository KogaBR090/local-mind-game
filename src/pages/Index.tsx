import { useState, useEffect } from 'react';
import { LoginScreen } from '@/components/LoginScreen';
import { MenuScreen } from '@/components/MenuScreen';
import { QuizScreen } from '@/components/QuizScreen';
import { AdminScreen } from '@/components/AdminScreen';
import { QuizStorage } from '@/services/quizStorage';
import { Question } from '@/types/quiz';
import { toast } from '@/hooks/use-toast';

type Screen = 'login' | 'menu' | 'quiz' | 'admin';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentUser, setCurrentUser] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Load questions on mount
  useEffect(() => {
    const loadedQuestions = QuizStorage.getQuestions();
    setQuestions(loadedQuestions);
    
    // Add some default questions if none exist
    if (loadedQuestions.length === 0) {
      const defaultQuestions: Question[] = [
        {
          id: '1',
          question: 'Qual é a capital do Brasil?',
          options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
          correctAnswer: 2,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          question: 'Quanto é 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          question: 'Qual é o maior planeta do sistema solar?',
          options: ['Terra', 'Marte', 'Júpiter', 'Saturno'],
          correctAnswer: 2,
          createdAt: new Date().toISOString()
        }
      ];
      
      defaultQuestions.forEach(question => QuizStorage.addQuestion(question));
      setQuestions(defaultQuestions);
    }
  }, []);

  const handleLogin = (userName: string, score: number) => {
    setCurrentUser(userName);
    setUserScore(score);
    setCurrentScreen('menu');
  };

  const handleLogout = () => {
    setCurrentUser('');
    setUserScore(0);
    setCurrentScreen('login');
  };

  const handleStartQuiz = () => {
    if (questions.length === 0) {
      toast({
        title: "Nenhuma questão disponível",
        description: "Adicione questões na administração primeiro.",
        variant: "destructive"
      });
      return;
    }
    setCurrentScreen('quiz');
  };

  const handleFinishQuiz = () => {
    setCurrentScreen('menu');
    toast({
      title: "Quiz finalizado!",
      description: `Parabéns ${currentUser}! Sua pontuação foi atualizada.`,
      variant: "default"
    });
  };

  const handleScoreUpdate = (newScore: number, questionsAnswered: number) => {
    setUserScore(newScore);
    QuizStorage.updateUserScore(currentUser, newScore, questionsAnswered);
  };

  const handleOpenAdmin = () => {
    setCurrentScreen('admin');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    // Reload questions in case they were modified
    setQuestions(QuizStorage.getQuestions());
  };

  const handleAddQuestion = (question: Question) => {
    QuizStorage.addQuestion(question);
    setQuestions(QuizStorage.getQuestions());
    toast({
      title: "Questão adicionada!",
      description: "Nova questão foi criada com sucesso.",
    });
  };

  const handleUpdateQuestion = (questionId: string, question: Question) => {
    QuizStorage.updateQuestion(questionId, question);
    setQuestions(QuizStorage.getQuestions());
    toast({
      title: "Questão atualizada!",
      description: "As alterações foram salvas.",
    });
  };

  const handleRemoveQuestion = (questionId: string) => {
    QuizStorage.removeQuestion(questionId);
    setQuestions(QuizStorage.getQuestions());
    toast({
      title: "Questão removida!",
      description: "A questão foi excluída com sucesso.",
      variant: "destructive"
    });
  };

  const handleResetAll = () => {
    QuizStorage.clearAll();
    setQuestions([]);
    setUserScore(0);
    toast({
      title: "Reset completo realizado!",
      description: "Todas as questões e pontuações foram apagadas.",
      variant: "destructive"
    });
  };

  // Render current screen
  switch (currentScreen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
      
    case 'menu':
      return (
        <MenuScreen
          userName={currentUser}
          userScore={userScore}
          questionCount={questions.length}
          onStartQuiz={handleStartQuiz}
          onOpenAdmin={handleOpenAdmin}
          onResetAll={handleResetAll}
          onLogout={handleLogout}
        />
      );
      
    case 'quiz':
      return (
        <QuizScreen
          userName={currentUser}
          userScore={userScore}
          questions={questions}
          onScoreUpdate={handleScoreUpdate}
          onFinish={handleFinishQuiz}
        />
      );
      
    case 'admin':
      return (
        <AdminScreen
          questions={questions}
          onAddQuestion={handleAddQuestion}
          onUpdateQuestion={handleUpdateQuestion}
          onRemoveQuestion={handleRemoveQuestion}
          onBack={handleBackToMenu}
        />
      );
      
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
};

export default Index;
