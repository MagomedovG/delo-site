import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Briefcase, Hammer } from "lucide-react";

interface OnboardingRoleSelectionProps {
  onSelectRole: (role: "poster" | "tasker") => void;
  onBack: () => void;
}

export function OnboardingRoleSelection({ onSelectRole, onBack }: OnboardingRoleSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl">Как вы хотите начать?</h2>
            <p className="text-gray-600">
              Вы всегда можете переключаться между публикацией и выполнением заданий
            </p>
          </div>

          <div className="space-y-4">
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-600"
              onClick={() => onSelectRole("poster")}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl">Публиковать задания</h3>
                    <p className="text-gray-600">Мне нужна помощь</p>
                  </div>
                </div>
                
                <ul className="text-left text-sm text-gray-600 space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Опишите, что нужно сделать</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Получайте предложения от исполнителей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Выберите, кого вы хотите нанять</span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-600"
              onClick={() => onSelectRole("tasker")}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center">
                    <Hammer className="w-7 h-7" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl">Стать исполнителем</h3>
                    <p className="text-gray-600">Я хочу зарабатывать</p>
                  </div>
                </div>
                
                <ul className="text-left text-sm text-gray-600 space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Просматривайте доступные задания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Делайте предложения на задания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Получайте оплату за выполненную работу</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Button 
          onClick={onBack}
          variant="ghost"
          className="w-full h-12"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Назад
        </Button>
      </div>
    </div>
  );
}