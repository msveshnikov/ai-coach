import { useEffect } from 'react';

export function Landing() {
    useEffect(() => {
        fetch('/landing.html')
            .then((response) => response.text())
            .then((html) => {
                document.getElementById('landing-container').innerHTML = html;
            });
    }, []);

    return <div id="landing-container"></div>;
}
