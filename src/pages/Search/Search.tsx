import Headling from '../../components/Headling/Headling';
import FilmDesc from '../../components/FilmDesc/FilmDesc';
import Paragraph from '../../components/Paragraph/Paragraph';
import Form from '../../components/Form/Form';
import { useState } from 'react';
import { AxiosError } from 'axios';
import SearchError from '../SearchError/SearchError';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { CardModel, searchMovies } from '../../api';

function Search() {

	const [cards, setCards] = useState<CardModel[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();
	const [isEmptySearch, setIsEmptySearch] = useState<boolean>(false);
	const user = useSelector((s: RootState) => s.user);

	const checkFavourites = (cardsArray: CardModel[]) => {
		cardsArray.forEach(item => {
			user.favourites.forEach(i => {
				if (i.IMDB_ID === item.IMDB_ID) {
					item.isFavourite = true;
				}
			});
		});
	};

	const getSearch = async (q: string) => {
		try {
			setIsLoading(true);
			setError(undefined);
			const results = await searchMovies(q);
			setIsEmptySearch(results.length === 0);
			checkFavourites(results);
			setCards(results);
			setIsLoading(false);
		} catch (e) {
			if (e instanceof AxiosError) {
				setError(e.message);
			}
			setIsLoading(false);
			return;
		}
	};

	return <>
		<Headling>Поиск</Headling>
		<Paragraph text={'Введите название фильма, сериала или мультфильма для поиска и добавления в избранное'}/>
		<Form onSubmit={getSearch} placehldr={'Введите название'} buttonText={'Найти'} />
		{isEmptySearch && <SearchError />}
		{!isLoading && <FilmDesc cards={cards} />}
		{isLoading && <>Загружаем фильмы...</> }
		{error && <>{error}</>}
	</>
	;
}

export default Search;
