export const apiCaller = {
	get(url, config) {
		let params = {
			mode: 'cors',
			headers: new Headers({
				'Content-Type': 'text/plain'
			})
		};
		params = Object.assign(params, config);
		return fetch(url, params);
	}
};
