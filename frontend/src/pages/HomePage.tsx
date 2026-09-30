import type { UserProfile } from '../types/auth.types';

interface HomePageProps {
	user: UserProfile;
}

export function HomePage({ user }: HomePageProps) {
	return (
		<main className="home-page">
			<section className="home-content" aria-labelledby="welcome-heading">
				<p className="home-eyebrow">SOCIAL APP</p>
				<h1 id="welcome-heading">Welcome to Social App</h1>
				<p>You are signed in as:</p>
				<strong>{user.email}</strong>
			</section>
		</main>
	);
}
