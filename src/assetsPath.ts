interface IAsset {
    type: 'image' | 'sound';
    path: string;
    name: string;
}

const assetsPath: IAsset[] = [
    { name: 'ship', path: './assets/image/ship.png', type: 'image' },
    { name: 'alien1', path: './assets/image/alien1.png', type: 'image' },
    { name: 'shot1', path: './assets/audio/shot1.mp3', type: 'sound' },
    { name: 'shot2', path: './assets/audio/shot2.mp3', type: 'sound' },
    { name: 'die', path: './assets/audio/die.mp3', type: 'sound' },
    { name: 'endLevel', path: './assets/audio/endlevel.mp3', type: 'sound' },
    { name: 'level', path: './assets/audio/level.mp3', type: 'sound' },
];

export default assetsPath;
