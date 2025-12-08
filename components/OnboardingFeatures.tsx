import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ArrowLeft, CheckCircle, Users, Shield, DollarSign } from "lucide-react";

interface OnboardingFeaturesProps {
  onNext: () => void;
  onBack: () => void;
}

const features = [
  {
    icon: CheckCircle,
    title: "Публикуйте задания",
    description: "От ремонта до виртуальной помощи – опубликуйте любое задание и установите свой бюджет.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Users,
    title: "Найдите исполнителей",
    description: "Просматривайте предложения от проверенных исполнителей и выбирайте лучшего.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: DollarSign,
    title: "Безопасные платежи",
    description: "Платите безопасно через нашу платформу. Деньги переводятся только после выполнения работы.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Shield,
    title: "Доверие и безопасность",
    description: "Все исполнители проверены. Читайте отзывы, проверяйте рейтинги и общайтесь безопасно.",
    color: "bg-blue-50 text-blue-600"
  }
];

export function OnboardingFeatures({ onNext, onBack }: OnboardingFeaturesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < features.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      onBack();
    }
  };

  const feature = features[currentSlide];
  const Icon = feature.icon;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className={`${feature.color} w-24 h-24 rounded-full flex items-center justify-center`}>
              <Icon className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl">{feature.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-4">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? "w-8 bg-blue-600" 
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button 
          onClick={handleNext}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {currentSlide < features.length - 1 ? "Далее" : "Продолжить"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button 
          onClick={handlePrevious}
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