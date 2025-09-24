import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

interface QuizScreenProps {
  userName: string;
  userScore: number;
  questions: Question[];
  onScoreUpdate: (newScore: number, questionsAnswered: number) => void;
  onFinish: () => void;
}

export const QuizScreen = ({ userName, userScore, questions, onScoreUpdate, onFinish }: QuizScreenProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setSessionScore(prev => prev + 1);
    }
    setTotalAnswered(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz finished
      const finalScore = userScore + sessionScore;
      onScoreUpdate(finalScore, totalAnswered);
      onFinish();
    }
  };

  useEffect(() => {
    // Reset quiz state when questions change
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionScore(0);
    setTotalAnswered(0);
  }, [questions]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">Nenhuma questão disponível.</p>
            <Button onClick={onFinish}>Voltar ao Menu</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Quiz - {userName}</h1>
            <p className="text-muted-foreground">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="secondary" className="text-lg">
              <Trophy className="w-4 h-4 mr-1" />
              {userScore + sessionScore} pts
            </Badge>
            <div className="text-sm text-muted-foreground">
              Sessão atual: +{sessionScore}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonVariant: "outline" | "default" | "destructive" | "secondary" = "outline";
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonVariant = "default"; // Correct answer is green
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonVariant = "destructive"; // Wrong selected answer is red
                }
              } else if (selectedAnswer === index) {
                buttonVariant = "secondary"; // Selected but not confirmed
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className="w-full text-left justify-start h-auto p-4 relative"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-medium min-w-[20px]">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span>{option}</span>
                  </span>
                  
                  {showResult && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto text-accent" />
                  )}
                  {showResult && index === selectedAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 ml-auto text-destructive" />
                  )}
                </Button>
              );
            })}

            {/* Action Buttons */}
            <div className="pt-4 space-x-3">
              {!showResult ? (
                <Button
                  onClick={handleConfirmAnswer}
                  disabled={selectedAnswer === null}
                  size="lg"
                >
                  Confirmar Resposta
                </Button>
              ) : (
                <div className="space-x-3">
                  <Button onClick={handleNextQuestion} size="lg">
                    {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
                  </Button>
                </div>
              )}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-accent/10' : 'bg-destructive/10'}`}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-medium">
                    {isCorrect ? 'Parabéns! Resposta correta!' : 'Ops! Resposta incorreta.'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};