import { useAuthFetchWithBase } from "@/hooks/useAuthFetchWithBase";
import { Button } from "./ui/button";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();
    const authFetch = useAuthFetchWithBase()
    const logOut = async () => {
        try {
            // Получаем токены из куков
            const accessToken = Cookies.get('access');
            const refreshToken = Cookies.get('refresh');

            // Отправляем запрос на логаут
            const response = await authFetch('/auth/logout', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                //     ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
                // },
                // body: JSON.stringify({
                //     refresh_token: refreshToken
                // })
            });

            // В любом случае очищаем куки и перенаправляем на логин
            Cookies.remove('access');
            Cookies.remove('refresh');
            
            // Перенаправляем на страницу логина
            router.push('/login');

            // Если запрос прошел успешно, можно показать сообщение
            if (response.ok) {
                console.log('Выход выполнен успешно');
            } else {
                console.warn('Выход выполнен, но сервер вернул ошибку');
            }

        } catch (error) {
            console.error('Ошибка при выходе:', error);
            // Даже при ошибке очищаем куки и перенаправляем
            // Cookies.remove('access');
            // Cookies.remove('refresh');
            // router.push('/login');
        }
    };

    return (
        <Button className="cursor-pointer" variant="ghost" size="sm" onClick={logOut}>
            Выйти
        </Button>
    );
}