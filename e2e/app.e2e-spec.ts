import { RdvPage } from './app.po';

describe('rdv App', () => {
  let page: RdvPage;

  beforeEach(() => {
    page = new RdvPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
