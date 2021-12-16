const tips = require("./tips")

describe('TipsService Class', () => {
    test("Checkin getTipsValue function if tips value are 0 or 10 ", function () {
        let result = tips.getTipsValue();
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(10);
    });
});

// const video = require('./video');
//
// test('plays video', () => {
//     const spy = jest.spyOn(video, 'play');
//     const isPlaying = video.play();
//
//     expect(spy).toHaveBeenCalled();
//     expect(isPlaying).toBe(true);
//
//     spy.mockRestore();
// });
