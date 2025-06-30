import userLogo from '../../../assets/user.svg';
import serverLogo from '../../../assets/Server.svg';
import locationLogo from '../../../assets/location.svg';

export type NewsType = {
  icon?: string; // иконка
  date: string; // дата
  newsHeadline: string; // заголовок
  link?: string; // ссылка на новость, если имеется
};

export const newsData: Array<NewsType> = [
  {
    icon: serverLogo,
    date: '30/06/2025',
    newsHeadline: 'We release the POLLUX dataset alongside a family of LM-as-a-Judge models!',
  }
];
