// A kanban board. Backstage UI has no board, so the columns are react-aria
// GridLists wired together with useDragAndDrop.
//
// Dragging is the mouse path. react-aria's keyboard drag depends on a hidden
// handle that is not reachable here, and a keyboard affordance you cannot find
// is not one — so every card also carries an explicit "Move" menu. That is the
// path the test drives, because it is the one a keyboard user would.
import type React from 'react';
import { useState } from 'react';
import {
  GridList,
  GridListItem,
  useDragAndDrop,
} from 'react-aria-components';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Menu,
  MenuItem,
  MenuTrigger,
  Text,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';

type ColumnId = 'backlog' | 'doing' | 'review' | 'done';

interface CardItem {
  id: string;
  title: string;
  service: string;
  owner: string;
  size: 'S' | 'M' | 'L';
}

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'doing', label: 'In progress' },
  { id: 'review', label: 'In review' },
  { id: 'done', label: 'Done' },
];

const INITIAL: Record<ColumnId, CardItem[]> = {
  backlog: [
    { id: 'PLAT-311', title: 'Retire the legacy importer', service: 'legacy-importer', owner: 'team-atlas', size: 'L' },
    { id: 'PLAT-309', title: 'Cache catalog reads at the edge', service: 'catalog-api', owner: 'team-atlas', size: 'M' },
    { id: 'PLAT-305', title: 'Alert on queue depth, not queue age', service: 'notification-hub', owner: 'team-signal', size: 'S' },
  ],
  doing: [
    { id: 'PLAT-298', title: 'Move deploy approvals into the service file', service: 'catalog-api', owner: 'team-atlas', size: 'L' },
    { id: 'PLAT-301', title: 'Backfill owners for unowned services', service: 'catalog-api', owner: 'team-vault', size: 'M' },
  ],
  review: [
    { id: 'PLAT-294', title: 'Rotate the CI deploy key', service: 'auth-gateway', owner: 'team-vault', size: 'S' },
  ],
  done: [
    { id: 'PLAT-288', title: 'Incident timelines on the service page', service: 'catalog-api', owner: 'team-signal', size: 'M' },
    { id: 'PLAT-284', title: 'Round deploy duration to the second', service: 'metrics-collector', owner: 'team-signal', size: 'S' },
  ],
};

export function BoardPage() {
  const [board, setBoard] = useState(INITIAL);

  const total = Object.values(board).reduce((sum, list) => sum + list.length, 0);

  /** Moves one card to the end of another column, from the card's own menu. */
  const moveCard = (id: string, to: ColumnId) => {
    setBoard((prev) => {
      let moved: CardItem | undefined;
      const next = {} as Record<ColumnId, CardItem[]>;
      for (const key of Object.keys(prev) as ColumnId[]) {
        next[key] = prev[key].filter((item) => {
          if (item.id !== id) return true;
          moved = item;
          return false;
        });
      }
      if (moved) next[to] = [...next[to], moved];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Board"
        description="Platform work in flight. Drag a card, or move it from its menu."
        metadata={[
          { label: 'Cards', value: String(total) },
          { label: 'In progress', value: String(board.doing.length) },
        ]}
      />

      <div className="board" role="group" aria-label="Board">
        {COLUMNS.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            board={board}
            setBoard={setBoard}
            onMove={moveCard}
          />
        ))}
      </div>
    </>
  );
}

function BoardColumn({
  column,
  board,
  setBoard,
  onMove,
}: {
  column: { id: ColumnId; label: string };
  board: Record<ColumnId, CardItem[]>;
  setBoard: React.Dispatch<React.SetStateAction<Record<ColumnId, CardItem[]>>>;
  onMove: (id: string, to: ColumnId) => void;
}) {
  const items = board[column.id];

  const move = (ids: string[], to: ColumnId, index: number) => {
    const moving: CardItem[] = [];
    const next = {} as Record<ColumnId, CardItem[]>;
    for (const key of Object.keys(board) as ColumnId[]) {
      next[key] = board[key].filter((item) => {
        if (!ids.includes(item.id)) return true;
        moving.push(item);
        return false;
      });
    }
    next[to] = [
      ...next[to].slice(0, index),
      ...moving,
      ...next[to].slice(index),
    ];
    setBoard(next);
  };

  const { dragAndDropHooks } = useDragAndDrop({
    // Cards carry their id as plain text so a drop can be resolved without
    // reading component state.
    getItems: (keys) =>
      [...keys].map((key) => ({ 'text/plain': String(key) })),
    acceptedDragTypes: ['text/plain'],
    onRootDrop: async (event) => {
      const ids = await Promise.all(
        event.items.map(async (item) =>
          item.kind === 'text' ? item.getText('text/plain') : '',
        ),
      );
      move(ids.filter(Boolean), column.id, items.length);
    },
    onItemDrop: async (event) => {
      const ids = await Promise.all(
        event.items.map(async (item) =>
          item.kind === 'text' ? item.getText('text/plain') : '',
        ),
      );
      const targetIndex = items.findIndex((item) => item.id === event.target.key);
      move(
        ids.filter(Boolean),
        column.id,
        event.target.dropPosition === 'after' ? targetIndex + 1 : targetIndex,
      );
    },
    getDropOperation: () => 'move',
  });

  return (
    <section className="board-column" aria-label={column.label}>
      <div className="board-column-head">
        <Text variant="body-small" as="h2">
          {column.label}
        </Text>
        <Badge>{items.length}</Badge>
      </div>

      <GridList
        aria-label={column.label}
        items={items}
        dragAndDropHooks={dragAndDropHooks}
        className="board-list"
        renderEmptyState={() => (
          <div className="board-empty">
            <Text variant="body-small" color="secondary">
              Nothing here
            </Text>
          </div>
        )}
      >
        {(item) => (
          <GridListItem
            key={item.id}
            id={item.id}
            textValue={`${item.id} ${item.title}`}
            className="board-card"
          >
            <Card>
              <CardBody>
                <Flex direction="column" gap="2">
                  <Flex align="center" justify="between" gap="2">
                    <Text variant="body-small" color="secondary" as="span">
                      {item.id}
                    </Text>
                    <Flex align="center" gap="2">
                      <span className="board-size" aria-label={`Size ${item.size}`}>
                        {item.size}
                      </span>
                      <MenuTrigger>
                        <Button
                          variant="secondary"
                          size="small"
                          aria-label={`Move ${item.id}`}
                        >
                          Move
                        </Button>
                        <Menu>
                          {COLUMNS.filter((target) => target.id !== column.id).map(
                            (target) => (
                              <MenuItem
                                key={target.id}
                                onAction={() => onMove(item.id, target.id)}
                              >
                                {target.label}
                              </MenuItem>
                            ),
                          )}
                        </Menu>
                      </MenuTrigger>
                    </Flex>
                  </Flex>
                  <Text as="span">{item.title}</Text>
                  <Text variant="body-small" color="secondary" as="span">
                    {item.service} · {item.owner}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </GridListItem>
        )}
      </GridList>
    </section>
  );
}
