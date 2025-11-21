import { Button } from "./ui/button";
import { Check, ArrowLeft } from "lucide-react";

interface OnboardingCompleteProps {
  role: "poster" | "tasker";
  onComplete: () => void;
  onBack: () => void;
}

export function OnboardingComplete({ role, onComplete, onBack }: OnboardingCompleteProps) {
  const isPoster = role === "poster";
  
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl">Всё готово!</h2>
            <p className="text-lg text-gray-600">
              {isPoster 
                ? "Вы готовы опубликовать своё первое задание и получить помощь от нашего сообщества исполнителей."
                : "Вы готовы начать зарабатывать, помогая другим выполнять их задания."
              }
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 space-y-3">
            <h3 className="font-medium">Следующие шаги:</h3>
            <ul className="text-left space-y-2 text-gray-700">
              {isPoster ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">1.</span>
                    <span>Заполните свой профиль</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">2.</span>
                    <span>Опубликуйте своё первое задание</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">3.</span>
                    <span>Просмотрите предложения от исполнителей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">4.</span>
                    <span>Наймите исполнителя и получите результат</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">1.</span>
                    <span>Заполните профиль и подтвердите личность</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">2.</span>
                    <span>Просмотрите доступные задания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">3.</span>
                    <span>Делайте предложения на подходящие задания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">4.</span>
                    <span>Выполняйте задания и зарабатывайте</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button 
          onClick={onComplete}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isPoster ? "Опубликовать задание" : "Смотреть задания"}
        </Button>
        
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