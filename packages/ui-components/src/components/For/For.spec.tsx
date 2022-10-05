import { render, waitFor } from '@testing-library/react';
import * as React from 'react';
import For from './For';

type User = {
  id: number;
  name: string;
  skills: string[];
};

const users: User[] = [
  { id: 1, name: 'Largs', skills: ['TypeScript', 'React', 'NextJS'] },
  { id: 2, name: 'Paulo', skills: ['TypeScript', 'React', 'NextJS'] },
  { id: 3, name: 'Chris', skills: ['TypeScript', 'React', 'NextJS'] },
  { id: 4, name: 'Glevs', skills: ['TypeScript', 'React', 'NextJS'] },
  { id: 5, name: 'NielB', skills: ['TypeScript', 'React', 'NextJS'] },
];

describe('For', () => {
  it('Should render list (even nested)', async () => {
    const { queryByText, queryAllByText } = render(
      <For each={users} getKey={({ id }) => id}>
        {({ id, name, skills }) => (
          <div>
            <h3>{name}</h3>

            <For each={skills} getKey={skill => id + skill}>
              {skill => (
                <ul>
                  <li>{skill}</li>
                </ul>
              )}
            </For>
          </div>
        )}
      </For>
    );

    for await (const { name, skills } of users) {
      await waitFor(() => {
        expect(queryByText(name)).toBeDefined();
      });

      await Promise.all(
        skills.map(async skill => {
          await waitFor(() => {
            expect(queryAllByText(skill).length).toBeGreaterThanOrEqual(1);
          });
        })
      );
    }
  });

  it('Should show fallback if list is empty', async () => {
    const { queryByText } = render(
      <For<User[]> each={[]} fallback={<p>No users found</p>}>
        {({ name }) => <div>{name}</div>}
      </For>
    );

    await waitFor(() => {
      expect(queryByText(/no users found/i)).toBeDefined();
    });
  });
});
