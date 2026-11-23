import styles from './Description.module.css';
import cl from 'classnames';
import { useLoaderData } from 'react-router';
import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { userActions } from '../../store/user.slice';
import { MovieModel } from '../../api';

function Description() {
	const loaded = useLoaderData() as MovieModel;
	const user = useSelector((s: RootState) => s.user);
	const dispatch = useDispatch<AppDispatch>();

	const initialCard: MovieModel = {
		...loaded,
		isFavourite: user.favourites.some(item => item.IMDB_ID === loaded.IMDB_ID)
	};

	const toggleFavourite = (e: MouseEvent) => {
		e.preventDefault();
		if (card.isFavourite === true) {
			setCard({...card, isFavourite: false});
			dispatch(userActions.removeFavourite(card));
		} else {
			setCard({...card, isFavourite: true});
			dispatch(userActions.addFavourite(card));
		}
	};

	const [card, setCard] = useState<MovieModel>(initialCard);

	return (
		<div className={styles['wrapper']}>
			<div className={styles['title']}>
				<p>Поиск фильмов</p>
				<h1>{card.TITLE}</h1>
			</div>
			<div className={styles['film-body']}>
				<img className={styles['film-image']} src={card.IMG_POSTER} alt={card.TITLE} />
				<div className={styles['description']}>
					<p className={styles['description-text']}>{card.description}</p>
					<div className={styles['description-rate']}>
						<div className={styles['description-rate-details']}>
							<img src="star.svg" alt="Рейтинг фильма" />
							{card.rate}
						</div>
						<div className={styles['card-wrapper-favourite']}>
							<img src={card.isFavourite ? 'favorite.svg' : 'like.svg'} alt="" />
							<button onClick={toggleFavourite} className={cl(styles['favourite-button'], {
								[styles['favourite']]: card.isFavourite
							})}>
								{card.isFavourite ? 'В избранном' : 'В избранное'}
							</button>
						</div>
					</div>
					<div className={styles['description-wrapper']}>
						<p className={styles['description-title']}>Тип</p>
						<p className={styles['description-text']}>{card.type}</p>
					</div>
					<div className={styles['description-wrapper']}>
						<p className={styles['description-title']}>Дата выхода</p>
						<p className={styles['description-text']}>{card.date}</p>
					</div>
					{card.duration && <div className={styles['description-wrapper']}>
						<p className={styles['description-title']}>Длительность</p>
						<p className={styles['description-text']}>{card.duration}</p>
					</div>}
					<div className={styles['description-wrapper']}>
						<p className={styles['description-title']}>Жанр</p>
						<p className={styles['description-text']}>{card.genre}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Description;
