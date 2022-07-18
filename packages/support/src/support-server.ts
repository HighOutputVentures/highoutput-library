import parse from 'co-body';
import { Request, Response, NextFunction } from 'express';
import { Client } from '@notionhq/client';

export class SupportServer {
  private notionClient: Client;
  constructor(
    private readonly params: {
      prefix: string;
      project: string;
      notionAccessToken: string;
      databaseId: string;
    },
  ) {
    this.notionClient = new Client({
      auth: this.params.notionAccessToken,
    });
  }

  public expressMiddleware() {
    const { prefix, project, databaseId } = this.params;
    const notionClient = this.notionClient;
    return async function (req: Request, res: Response, next: NextFunction) {
      const url = new URL(
        req.url!,
        `${
          !req.headers.host!.startsWith('http://') ||
          !req.headers.host!.startsWith('https://')
            ? 'http://'
            : ''
        }${req.headers.host}`,
      );

      if (prefix && !url.pathname.startsWith(prefix)) {
        return;
      }

      if (
        req.method === 'POST' &&
        `${prefix ? prefix : ''}/messages` === url.pathname
      ) {
        const body = await parse.json(req);

        if (!body.emailAddress) {
          res.set('Content-Type', 'application/json');
          res.status(400);
          res.send({
            error: {
              code: 'INVALID_EMAIL_ADDRESS',
              message: 'Email Address is invalid.',
            },
          });

          return;
        }

        const tableData = [
          {
            type: 'table_row',
            table_row: {
              cells: [
                [
                  {
                    type: 'text',
                    text: {
                      content: 'Field',
                    },
                  },
                ],
                [
                  {
                    type: 'text',
                    text: {
                      content: 'Value',
                    },
                  },
                ],
              ],
            },
          },
        ];

        tableData.push(
          ...Object.keys(body.details).map((key) => {
            return {
              type: 'table_row',
              table_row: {
                cells: [
                  [
                    {
                      type: 'text',
                      text: {
                        content: key,
                      },
                    },
                  ],
                  [
                    {
                      type: 'text',
                      text: {
                        content: body.details[key],
                      },
                    },
                  ],
                ],
              },
            };
          }),
        );

        const databaseData = await notionClient.pages.create({
          parent: {
            database_id: databaseId,
          },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: body.emailAddress,
                  },
                },
              ],
            },
            'Email Address': {
              email: body.emailAddress,
            },
            Project: {
              select: {
                name: project,
              },
            },
          },
          children: [
            {
              type: 'heading_2',
              //...other keys excluded
              heading_2: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: 'Message',
                      link: null,
                    },
                  },
                ],
                color: 'default',
              },
            },
            {
              type: 'paragraph',
              //...other keys excluded
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: body.message,
                      link: null,
                    },
                  },
                ],
                color: 'default',
              },
            },
            {
              type: 'heading_2',
              //...other keys excluded
              heading_2: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: 'Details',
                      link: null,
                    },
                  },
                ],
                color: 'default',
              },
            },
            {
              type: 'table',
              table: {
                table_width: 2,
                has_column_header: true,
                has_row_header: false,
                children: tableData as never,
              },
            },
          ],
        });

        res.set('Content-Type', 'application/json');
        res.status(201);
        res.send(databaseData);

        return;
      }

      next();
    };
  }
}
