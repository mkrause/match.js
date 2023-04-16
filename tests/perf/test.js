
import b from 'benny';
import match from '../../src/match.js';


const pickRandom = items => items[Math.floor(Math.random() * items.length)];

b.suite(
    'Comparison',
    
    b.add('switch', () => {
        const colors = ['red', 'green', 'blue'];
        
        const color = pickRandom(colors);
        
        let result;
        switch (color) {
            case 'red': result = 'R'; break;
            case 'green': result = 'G'; break;
            case 'blue': result = 'B'; break;
        }
    }),
    
    b.add('match', () => {
        const colors = ['red', 'green', 'blue'];
        
        const color = pickRandom(colors);
        
        const result = match(color, {
            red: 'R',
            green: 'G',
            blue: 'B',
        });
    }),
    
    b.cycle(),
    b.complete(),
);
