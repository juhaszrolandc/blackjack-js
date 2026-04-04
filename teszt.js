// 3 + 4 + 6 + 10 + ace = 14 ???

const list = [3,4,6,11,10];

function handEvaluator(){

    let newHandValue = 34;
    let acesCount = 1;

    while( newHandValue > 21 && acesCount > 0 ) {
        newHandValue -= 11;
        newHandValue += 1;
        acesCount--;
    }

    return newHandValue;
}

console.log( handEvaluator() );