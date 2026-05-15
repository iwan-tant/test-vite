


export class Wislib {

	private isConsumingSession = false;
	private isSendingScore = false;

	async initWislb(isProduction: boolean) {
		const params = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams, prop) => searchParams.get(prop as string),
		});
		const ignoreApiErrParam = (params as any)?.["ignore-api-err"] || "";
		let ignoreApiCallErr = ignoreApiErrParam == "true";

		let option = {
			baseUrl: "https://staging-api.wis-wis.com",
			k: "89f0eec23be4308c4886fa1ba4563baa",
			idv: "1614556800000000",
			redirectUrl: "https://staging-gamified-redirect.wis-wis.com/",
			showPopup: true,
			ignoreApiCallErr: ignoreApiCallErr,
		};

		if (isProduction) {
			option = {
				baseUrl: "https://api.wis-wis.com",
				k: "a39ac51cfb727a425f688bb55fc29a42",
				idv: "1614556800000000",
				redirectUrl: "https://gamified-redirect.wis-wis.com/",
				showPopup: true,
				ignoreApiCallErr: ignoreApiCallErr,
			};
		}

		await (window as any).wislib.wiswis.init(option);
	}

	consumeSession(onComplete: () => void) {
		if (this.isConsumingSession) { return; }

		this.isConsumingSession = true;
		(window as any).wislib.wiswis.consumeSession();
		const interval = setInterval(() => {
			const isSessionConsumed = (window as any).wislib.wiswis.getIsSessionConsumed();
			if (isSessionConsumed) {
				clearInterval(interval);
				onComplete();
			}
		}, 200);
	}

	sendScore(score: number, onComplete: () => void) {
		if (this.isSendingScore) { return; }

		this.isSendingScore = true;
		(window as any).wislib.wiswis.sendScore(score);
		const interval = setInterval(() => {
			const isScoreSubmited = (window as any).wislib.wiswis.getIsScoreSubmited();
			if (isScoreSubmited) {
				clearInterval(interval);
				onComplete();
			}
		}, 200);
	}

	finishSession() {
		(window as any).wislib.wiswis.finishSession();
	}
}

const wislib = new Wislib();
export default wislib;