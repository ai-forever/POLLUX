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
    icon: userLogo,
    date: '11/03/2025',
    newsHeadline: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    icon: locationLogo,
    date: '23/02/2025',
    newsHeadline:
      'Suspendisse convallis tellus sit amet arcu vehicula, eget semper enim efficitur.',
  },
  {
    icon: serverLogo,
    date: '21/01/2025',
    newsHeadline: 'Nulla a lorem laoreet lacus commodo lacinia.',
  },
];
