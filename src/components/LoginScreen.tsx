import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizStorage } from '@/services/quizStorage';
import { User } from '@/types/quiz';

interface LoginScreenProps {
  onLogin: (userName: string, userScore: number) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [userName, setUserName] = useState('');
  const [existingUser, setExistingUser] = useState<User | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);
    
    if (name.trim()) {
      const user = QuizStorage.getUser(name.trim());
      setExistingUser(user);
    } else {
      setExistingUser(null);
    }
  };

  const handleLogin = () => {
    if (!userName.trim()) return;
    
    const userScore = existingUser ? existingUser.score : 0;
    onLogin(userName.trim(), userScore);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Quiz App</CardTitle>
          <CardDescription>
            Digite seu nome para começar a jogar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Seu nome..."
              value={userName}
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              className="text-center"
              autoFocus
            />
          </div>
          
          {existingUser && (
            <div className="bg-accent/10 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Bem-vindo de volta!</p>
              <p className="font-medium">
                Pontuação atual: <span className="text-accent font-bold">{existingUser.score}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Questões respondidas: {existingUser.questionsAnswered}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleLogin} 
            disabled={!userName.trim()}
            className="w-full"
            size="lg"
          >
            {existingUser ? 'Continuar Jogando' : 'Começar Quiz'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};