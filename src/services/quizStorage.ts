import { Question, User } from '@/types/quiz';

const QUESTIONS_KEY = 'quiz_questions';
const USERS_KEY = 'quiz_users';

export const QuizStorage = {
  // Questions management
  getQuestions(): Question[] {
    try {
      const questions = localStorage.getItem(QUESTIONS_KEY);
      return questions ? JSON.parse(questions) : [];
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  },

  saveQuestions(questions: Question[]): void {
    try {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  },

  addQuestion(question: Question): void {
    const questions = this.getQuestions();
    questions.push(question);
    this.saveQuestions(questions);
  },

  removeQuestion(questionId: string): void {
    const questions = this.getQuestions().filter(q => q.id !== questionId);
    this.saveQuestions(questions);
  },

  updateQuestion(questionId: string, updatedQuestion: Question): void {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      questions[index] = updatedQuestion;
      this.saveQuestions(questions);
    }
  },

  // Users management
  getUsers(): User[] {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  },

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  },

  getUser(name: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.name.toLowerCase() === name.toLowerCase()) || null;
  },

  updateUserScore(name: string, newScore: number, questionsAnswered: number): void {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex(user => user.name.toLowerCase() === name.toLowerCase());
    
    if (existingUserIndex !== -1) {
      users[existingUserIndex].score = newScore;
      users[existingUserIndex].questionsAnswered = questionsAnswered;
      users[existingUserIndex].lastPlayed = new Date().toISOString();
    } else {
      users.push({
        name,
        score: newScore,
        questionsAnswered,
        lastPlayed: new Date().toISOString()
      });
    }
    
    this.saveUsers(users);
  },

  // Complete reset
  clearAll(): void {
    try {
      localStorage.removeItem(QUESTIONS_KEY);
      localStorage.removeItem(USERS_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};