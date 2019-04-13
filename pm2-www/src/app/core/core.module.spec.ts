import { CoreModule } from '../../../../../pm2-www/src/app/core/core.module';

describe('CoreModule', () => {
    let coreModule: CoreModule;

    beforeEach(() => {
        coreModule = new CoreModule(null);
    });

    it('should create an instance', () => {
        expect(coreModule).toBeTruthy();
    });
});
