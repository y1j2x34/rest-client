import { expect } from 'chai';
import { join } from '../../../src/core/path';

describe('test path.join', () => {
    it('join nothing should returns empty string ', () => {
        expect(join()).eql('');
    });
    it('join simple texts', () => {
        expect(join('a', 'b')).eql('a/b');
    });
    it('multiple separators should replace to single separator', () => {
        expect(join('a/', '/b')).eql('a/b');
        expect(join('a//', 'b')).eql('a/b');
        expect(join('a', '//b')).eql('a/b');
        expect(join('a//', '//b')).eql('a/b');
        expect(join('a///', '//b')).eql('a/b');
        expect(join('a///', '/////b')).eql('a/b');
    });
    it('the path separator charactor in the head of string should be removed', () => {
        expect(join('a', 'b')).eql('a/b');
        expect(join('/a', 'b')).eql('a/b');
        expect(join('//a', 'b')).eql('a/b');
        expect(join('///a', 'b')).eql('a/b');
    });
    it('the path separator charactor in the tail of string should be removed', () => {
        expect(join('a', 'b')).eql('a/b');
        expect(join('a', 'b/')).eql('a/b');
        expect(join('a', 'b//')).eql('a/b');
        expect(join('a', 'b///')).eql('a/b');
    });
    it('illegal parts should be ignored', () => {
        expect(join('a', null as any, undefined as any, 'b')).eq('a/b');
    });
    it('join url', () => {
        expect(join('https://google.com.hk', 'index.html')).eql(
            'https://google.com.hk/index.html'
        );
    });
});
