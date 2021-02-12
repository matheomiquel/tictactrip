const stringReduce = function (string) {
    let array = [];
    let tmp = "";
    for (let i = 0; i < string.length; i++) {
        if (string[i] != '\n') {
            tmp += string[i]
        } else {
            if (tmp) {
                array.push(tmp);
            }
            array.push('\n');
            tmp = "";
        }
    }
    array.push(tmp);

    return array;
}
const justify = function (arr) {

    if (!arr) {
        return "\n"
    }
    let array = [];
    const result = arr.reduce((accumulator, currentValue) => {
        if ((accumulator.length + currentValue.length + 1) <= 80) {
            if (!accumulator) {
                return `${currentValue}`
            } else {
                return `${accumulator} ${currentValue}`
            }
        } else {
            if (accumulator) {
                array.push(`${accumulator}`);
            }
            if (currentValue.length > 80) {
                const result = currentValue.match(/.{1,80}/g).map(str => `${str}`);
                if (result[result.length - 1] != 80) {
                    currentValue = result[result.length - 1]
                    result.splice(result.length - 1, 1)
                    array.push(...result);
                }
            }
            return currentValue
        }
    }, "");
    array.push(result)
    return array.join('\n');
};

const addSpace = function addSpaceForJustify(array) {
    const result = array.map((line, index) => {
        if (!line.match(/\S/g)) {
            return '\n'
        }
        if (index === array.length - 1 || line.length === 80) {
            return `${line}`;
        } else {
            let newLine = "";
            const word = (line.match(/\S+/g))
            const letter = (line.match(/\S/g))
            let space = (80 - letter.length)
            let addSpace = [];
            let remainingWord = word.length - 1;
            for (let i = 0; i < word.length - 1; i++) {
                let tmp = "";
                let j;

                for (j = 0; j < Math.ceil(space / (remainingWord)); j++) {
                    tmp += " ";
                }
                remainingWord -= 1;
                space -= j
                addSpace.push(tmp);
            }
            for (let i = 0; i < addSpace.length; i++) {
                newLine += `${word[i]}${addSpace[i]}`
            }
            newLine += `${word[word.length - 1]}`;
            return newLine
        }
    });
    return result
}
module.exports = {
    stringReduce,
    justify,
    addSpace
}
