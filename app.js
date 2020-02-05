const url = '/content/lesson.html';

const goToSlide = (delta) => {
    const currentSlide = document.querySelector('.slide.current');
    const index = currentSlide.getAttribute('data-index') | 0;
    currentSlide.classList
        .remove('current');
    document.querySelector(`.slide-${index + delta * 1}`)
        .classList.add('current');
}

const setupSlides = () => {
    const slides = [...document.getElementsByClassName('slide')];
    slides.forEach((slide, index) => {
        slide.classList.add(`slide-${index}`);
        slide.setAttribute('data-index', index);
    });

    slides[0].classList.add('current');

    document.querySelector('.btn.next')
        .addEventListener('click', () => goToSlide(+1));

    document.querySelector('.btn.prev')
        .addEventListener('click', () => goToSlide(-1));
};

const createJudgePlugin = ({ executionType, executionStrategy, code }) => {
    const html = `
    <pre><code>${code}</code></pre>
    <button class="btn submit">Submit</button>
`

    const holder = document.createElement('div');
    holder.classList.add('code-task');
    holder.setAttribute('data-executionType', executionType);
    holder.setAttribute('data-executionStrategy', executionStrategy);

    holder.innerHTML = html;
    return holder;
};

const isSubmitButton = (button) => {
    return button.classList.contains('submit') &&
        button.classList.contains('btn');
}

const setupJudgePlugins = async () => {
    const judgePlugins = document.querySelectorAll('[type="text/judge"]');
    judgePlugins.forEach(
        pluginConfig => {
            window.mystuff = pluginConfig.innerHTML;
            const config = JSON.parse(pluginConfig.innerHTML);
            const plugin = createJudgePlugin(config);
            pluginConfig.parentNode.appendChild(plugin);
        }
    );

    document.body.addEventListener('click', function (ev) {
        if (!isSubmitButton(ev.target)) {
            return;
        }

        const codeTask = ev.target.parentNode;
        const executionType =  codeTask.getAttribute('data-executionType');
        const executionStrategy =  codeTask.getAttribute('data-executionStrategy');
        const code = "print('It works')";
        const config = {
            executionType,
            executionStrategy,
            code,
            executionDetails: {}
        };

        const url = 'https://development.softuni.org/api/judge/executeSubmission/';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(config),
            headers: {
                'content-type': 'application/json',
            },
        })
        .then(x => x.text())
        .then(x => console.log(x));
    });
};

const setupPlugins = () => {
    return Promise.all([
        setupJudgePlugins(),
    ]);
};

const setupEngine = () => {
    setupSlides();
    return setupPlugins();
};

const run = async () => {
    const resp = await fetch(`${url}?q=${Math.random()}`);
    const html = await resp.text();
    document.getElementById('content')
        .innerHTML = html;
    return setupEngine();
};

run();