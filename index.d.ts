/* =================== USAGE ===================

    import * as Koa from 'koa';
    import * as views from 'koa-views';

    const app = new Koa();
    const render = views(__dirname + '/views', {
        map: {
            html: 'underscore'
        }
    });
    app.context.render = render();
    // app.use(render);

    app.use(async function (ctx, next) {
        await ctx.render('user', {
            user: 'John'
        });
    });

 =============================================== */
import { Middleware } from 'koa'
type viewsOptions = {
    /*
    * Whether to use ctx.body to receive the rendered template string. Defaults to true.
    */
    autoRender?: boolean,
    /*
    * Default extension for your views
    */
    extension?: string,
    /*
    * Map a file extension to an engine
    */
    map?: any,
    /*
    * replace consolidate as default engine source
    */
    engineSource?: any,
    /*
    * These options will get passed to the view engine. This is the time to add partials and helpers etc.
    */
    options?: any,
}

/**
 * return Function or Koa.middleware
 * @param root Where your views are located. Must be an absolute path. All rendered views are relative to this path
 * @param opts (optional)
 */
declare function views(root: string, opts?: viewsOptions): Middleware
declare namespace views {
    const viewsOptions: viewsOptions;
}

export = views

declare module 'koa' {
    interface Context {
        render(viewPath: string, locals?: any): Promise<void>
    }
}
