const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

// const directorsJson = [
//   { "name": "Quentin Tarantino", "age": 55 }, // 624ac8a9f5f01bb9a385f587
//   { "name": "Michael Radford", "age": 72 }, // 624ac91487b20007cfb66779
//   { "name": "James McTeigue", "age": 51 }, // 624ac94dcb1758c7d05b9b0f
//   { "name": "Guy Ritchie", "age": 50 }, // 624ac9b25b4a67f16d4da687
//   { "name": "Test Direktor", "age": 35 }, // 624ae088001a1e0805163d73
// ];
// // directorId - it is ID from the directors collection
// const moviesJson = [
//   { "name": "Pulp Fiction", "genre": "Crime", "directorId": "624ac8a9f5f01bb9a385f587" },
//   { "name": "1984", "genre": "Sci-Fi", "directorId": "624ac91487b20007cfb66779" },
//   { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "624ac94dcb1758c7d05b9b0f" },
//   { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "624ac9b25b4a67f16d4da687" },
//   { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "624ac8a9f5f01bb9a385f587" },
//   { "name": "The Hateful Eight", "genre": "Crime", "directorId": "624ac8a9f5f01bb9a385f587" },
//   { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "624ac8a9f5f01bb9a385f587" },
//   { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "624ac9b25b4a67f16d4da687" },
//   { "name": "Test Movie", "genre": "Crime-Comedy", "directorId": "624ae088001a1e0805163d73" },
//   { "name": "Test Movie part2", "genre": "Crime-Comedy", "directorId": "624ae088001a1e0805163d73" },
// ];

// const movies = [
// 	{ id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1', },
// 	{ id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2', },
// 	{ id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3', },
// 	{ id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4', },
//   { id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
// 	{ id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
// 	{ id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
// 	{ id: '8', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
// ];

// const directors = [
// 	{ id: '1', name: 'Quentin Tarantino', age: 55 },
// 	{ id: '2', name: 'Michael Radford', age: 72 },
// 	{ id: '3', name: 'James McTeigue', age: 51 },
// 	{ id: '4', name: 'Guy Ritchie', age: 50 },
// ];
const MovieType = new GraphQLObjectType({
	name: 'Movie',
	fields: () => ({
	  id: { type: GraphQLID },
	  name: { type: new GraphQLNonNull(GraphQLString) },
	  genre: { type: new GraphQLNonNull(GraphQLString) },
	  rate: { type: new GraphQLNonNull(GraphQLInt) },
	  watched: { type: GraphQLBoolean },
		  director: {
			  type: DirectorType,
			  resolve(parent, args) {
				  // return directors.find(director => director.id === parent.id);
				return Directors.findById(parent.directorId);
			}
		}
	}),
});
  
const DirectorType = new GraphQLObjectType({
	name: 'Director',
	fields: () => ({
	  id: { type: GraphQLID },
	  name: { type: new GraphQLNonNull(GraphQLString) },
	  age: { type: new GraphQLNonNull(GraphQLInt) },
		  movies: {
			  type: new GraphQLList(MovieType),
			  resolve(parent, args) {
				  // return movies.filter(movie => movie.directorId === parent.id);
				return Movies.find({ directorId: parent.id });
			},
		},
	}),
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDirector: {
			type: DirectorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				const director = new Directors({
					name: args.name,
					age: args.age,
				});
				return director.save();
			},
		},
		addMovie: {
			type: MovieType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
				rate: { type: new GraphQLNonNull(GraphQLInt) },
				watched: { type: GraphQLBoolean },
			},
			resolve(parent, args) {
				const movie = new Movies({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId,
					rate: args.rate,
					watched: args.watched,
				});
				return movie.save();
			},
		},
		deleteDirector: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Directors.findByIdAndRemove(args.id);
			}
		},
		deleteMovie: {
			type: MovieType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Movies.findByIdAndRemove(args.id);
			}
		},
		updateDirector: {
			type: DirectorType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				return Directors.findByIdAndUpdate(
					args.id,
					{ $set: { name: args.name, age: args.age } },
					{ new: true },
				);
			},
		},
		updateMovie: {
			type: MovieType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
				rate: { type: new GraphQLNonNull(GraphQLInt) },
				watched: { type: GraphQLBoolean },
			},
			resolve(parent, args) {
				return Movies.findByIdAndUpdate(
					args.id,
					{ $set: { name: args.name, genre: args.genre, directorId: args.directorId, rate: args.rate,
						watched: args.watched,} },
					{ new: true },
				);
			},
		},
	}
});
  
const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
	  movie: {
		type: MovieType,
		args: { id: { type: GraphQLID } },
		resolve(parent, args) {
		  // return movies.find(movie => movie.id === args.id);
			return Movies.findById(args.id);
		},
	},
		director: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
		  // return directors.find(director => director.id === args.id);
				  return Directors.findById(args.id);
		},
	},
		movies: {
			  type: new GraphQLList(MovieType),
			  resolve(parent, args) {
				  // return movies;
				  return Movies.find({});
			  }
		},
		directors: {
			  type: new GraphQLList(DirectorType),
			  resolve(parent, args) {
				  // return directors;
				  return Directors.find({});
			}
		}
	}
});
  
module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
});