import axios from 'axios';

// API «ПоискКино» — https://api.poiskkino.dev/documentation
// Тестовый ключ (200 запросов в сутки) — для демо-сайта достаточно.
const API_KEY = 'JP57RCJ-1SE45FX-K6ZRR7D-3BVQ8JV';

const api = axios.create({
	baseURL: 'https://api.poiskkino.dev',
	headers: { 'X-API-KEY': API_KEY },
	timeout: 15000
});

export interface CardModel {
	IMDB_ID: number;
	TITLE: string;
	IMG_POSTER: string;
	RANK: number;
	isFavourite?: boolean;
}

export interface MovieModel extends CardModel {
	description: string;
	rate: number;
	type: string;
	date: string;
	duration: string;
	genre: string;
}

const TYPE_LABELS: Record<string, string> = {
	movie: 'Фильм',
	'tv-series': 'Сериал',
	cartoon: 'Мультфильм',
	anime: 'Аниме',
	'animated-series': 'Анимационный сериал',
	short: 'Короткометражный',
	'tv-show': 'ТВ-шоу'
};

const toCard = (doc: any): CardModel => ({
	IMDB_ID: doc.id,
	TITLE: doc.name || doc.alternativeName || 'Без названия',
	IMG_POSTER: doc.poster?.url || '',
	RANK: doc.rating?.kp ?? 0,
	isFavourite: false
});

export const searchMovies = async (query: string): Promise<CardModel[]> => {
	const { data } = await api.get('/v1.5/movie/search', {
		params: { query, limit: 20 }
	});
	return (data.docs || []).map(toCard);
};

export const getMovie = async (id: string): Promise<MovieModel> => {
	const { data } = await api.get(`/v1.5/movie/${id}`);
	const minutes: number = data.movieLength || 0;
	return {
		...toCard(data),
		description: data.description || data.shortDescription || '',
		rate: data.rating?.kp ?? 0,
		type: TYPE_LABELS[data.type] || data.type || '—',
		date: data.premiere?.world
			? new Date(data.premiere.world).toLocaleDateString('ru-RU')
			: String(data.year || '—'),
		duration: minutes ? `${Math.floor(minutes / 60)} ч ${minutes % 60} мин` : '',
		genre: (data.genres || []).map((g: { name: string }) => g.name).join(', ')
	};
};
