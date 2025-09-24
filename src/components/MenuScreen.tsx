import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizStorage } from '@/services/quizStorage';
import { Play, Settings, RotateCcw, Trophy, User, LogOut, Crown, Medal, Award } from 'lucide-react';

interface MenuScreenProps {
  userName: string;
  userScore: number;
  questionCount: number;
  onStartQuiz: () => void;
  onOpenAdmin: () => void;
  onResetAll: () => void;
  onLogout: () => void;
}

export const MenuScreen = ({ 
  userName, 
  userScore, 
  questionCount, 
  onStartQuiz, 
  onOpenAdmin, 
  onResetAll,
  onLogout 
}: MenuScreenProps) => {
  const user = QuizStorage.getUser(userName);
  const topUsers = QuizStorage.getTopUsers(5);
  
  const handleResetAll = () => {
    if (window.confirm('Tem certeza que deseja apagar TODAS as questões e pontuações? Esta ação não pode ser desfeita!')) {
      onResetAll();
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Quiz App</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <User className="w-4 h-4" />
            <span className="text-lg font-medium">{userName}</span>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            <Trophy className="w-4 h-4 mr-1" />
            {userScore} pontos
          </Badge>
        </div>

        {/* User Stats */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Suas Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{user.score}</div>
                  <div className="text-sm text-muted-foreground">Pontuação Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{user.questionsAnswered}</div>
                  <div className="text-sm text-muted-foreground">Questões Respondidas</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Último jogo: {new Date(user.lastPlayed).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {/* Start Quiz */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Jogar Quiz</h3>
                  <p className="text-muted-foreground">
                    {questionCount > 0 
                      ? `${questionCount} questões disponíveis`
                      : 'Nenhuma questão disponível'
                    }
                  </p>
                </div>
                <Play className="w-8 h-8 text-primary" />
              </div>
              <Button 
                onClick={onStartQuiz} 
                disabled={questionCount === 0}
                className="w-full"
                size="lg"
              >
                {questionCount > 0 ? 'Começar Quiz' : 'Sem Questões'}
              </Button>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Administração</h3>
                  <p className="text-muted-foreground">
                    Gerenciar questões do quiz
                  </p>
                </div>
                <Settings className="w-8 h-8 text-muted-foreground" />
              </div>
              <Button onClick={onOpenAdmin} variant="outline" className="w-full" size="lg">
                Gerenciar Questões
              </Button>
            </CardContent>
          </Card>

        {/* Top 5 Ranking */}
          {topUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Ranking Top 5
                </CardTitle>
                <CardDescription>
                  Os melhores jogadores do quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((topUser, index) => {
                    const position = index + 1;
                    const isCurrentUser = topUser.name.toLowerCase() === userName.toLowerCase();
                    
                    return (
                      <div
                        key={topUser.name}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isCurrentUser 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(position)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                                {topUser.name}
                              </span>
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs">
                                  Você
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {topUser.questionsAnswered} questões respondidas
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{topUser.score}</div>
                          <div className="text-xs text-muted-foreground">pontos</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {topUsers.length < 5 && (
                  <div className="mt-3 p-3 border-2 border-dashed border-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      {5 - topUsers.length} posições ainda disponíveis no ranking!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions Row */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={onLogout} variant="outline" className="h-14">
              <LogOut className="w-4 h-4 mr-2" />
              Trocar Usuário
            </Button>
            <Button onClick={handleResetAll} variant="destructive" className="h-14">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Completo
            </Button>
          </div>
        </div>

        {/* Info */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <CardDescription className="text-center text-xs">
              Todos os dados são salvos localmente no seu navegador.
              <br />
              Para começar, adicione algumas questões na administração.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};