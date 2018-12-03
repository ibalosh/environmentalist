import {Router, Response, Request} from 'express';
import * as habitat from "../../handler";
import {Slack} from "../../index";

const router: Router = Router();
const environmentManager: habitat.Manager = new habitat.Manager(new habitat.ApiResponse());

/**
 * Environments status route.
 */
router.post('/status', function (req: Request, res: Response) {
    let response: habitat.Response = environmentManager.environmentStatus();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Free environment route.
 */
router.post('/free', function (req: Request, res: Response) {
    let response: habitat.Response = environmentManager.freeEnvironment(
        req.body.text, new habitat.User(req.body.user_name, req.body.user_id));

    res.setHeader('Content-Type', 'application/json');
    res.status(response.statusCode).send(response.message);
});

/**
 * Take environment route.
 */
router.post('/take', function (req: Request, res: Response) {
    let slack: Slack = new Slack();
    slack.findUserByEmail(req.body.user_email).then( (slackResponse: any) => {
        req.body.user_id = slackResponse.user.id;
        req.body.user_name = slackResponse.user.name;

        let response: habitat.Response = environmentManager.takeEnvironmentByMessage(
            req.body.text, new habitat.User(req.body.user_name, req.body.user_id));

        res.setHeader('Content-Type', 'application/json');
        res.status(response.statusCode).send(response.message);
    });
});

export const EnvironmentsAPI: Router = router;