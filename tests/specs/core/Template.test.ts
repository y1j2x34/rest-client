import { expect } from 'chai';
import TemplateParser from '../../../src/core/Template';

describe('test template parser', () => {
    describe('not escaped prefix and suffix', () => {
        let parser: TemplateParser;
        before(() => {
            parser= new TemplateParser(':', '(?=(/|\\+))', true);
        });
        it('should not escape special characters in regular expression', () => {
            expect((parser as any).regex).eqls(/:(.*?)(?=(\/|\+))/g);
        })
        it('all matched placeholders should be replaced', () => {
            const parsed = parser.parse('http://127.0.0.1:8989/api/:who/:where/').execute({
                who: 'mario',
                where: 'USA'
            }, key => ':'+key);
            expect(parsed).eql('http://127.0.0.1:8989/api/mario/USA/');
        });
    });
    describe('escaped prefix and suffix', () => {
        let parser: TemplateParser;
        before(() => {
            parser = new TemplateParser('${', '}', false);
        })
        it('should escape special characters in regular expression', () => {
            expect((parser as any).regex).eqls(/\$\{(.*?)\}/g);
        })
        it('all matched placeholders should be replaced', () => {
            const parsed = parser.parse('http://127.0.0.1:8989/api/${who}/${where}/').execute({
                who: 'mario',
                where: 'USA'
            });
            expect(parsed).eql('http://127.0.0.1:8989/api/mario/USA/');
        })
    });
});
