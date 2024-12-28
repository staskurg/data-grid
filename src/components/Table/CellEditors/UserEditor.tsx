import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  CircularProgress,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  type DropdownCloseReason,
  useDropdown,
} from 'src/context/DropdownContext';
import { useUsers } from 'src/hooks/apiHooks';
import UserElement from 'src/ui/UserElement';

import type { User } from 'shared/types';

type UserEditorProps = {
  initialValue: User[];
  onComplete: (value: User[]) => void;
  onCancel: () => void;
};

const UserEditor = ({
  initialValue,
  onComplete,
  onCancel,
}: UserEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>(initialValue);
  const { showDropdown, hideDropdown, isDropdownOpen } = useDropdown();
  const { data: users, isLoading } = useUsers({ enabled: isDropdownOpen });

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleDropdownClose = useCallback(
    (reason: DropdownCloseReason) => {
      if (
        reason === 'escape' ||
        JSON.stringify(selectedUsers) === JSON.stringify(initialValue)
      ) {
        onCancel();
      } else {
        onComplete(selectedUsers);
      }
      hideDropdown();
    },
    [selectedUsers, initialValue, onComplete, onCancel, hideDropdown]
  );

  const handleUserToggle = useCallback(
    (user: User) => {
      const isSelected = selectedUsers.some(u => u.id === user.id);
      const newSelectedUsers = isSelected
        ? selectedUsers.filter(u => u.id !== user.id)
        : [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
    },
    [selectedUsers]
  );

  const filteredUsers = useMemo(
    () =>
      users?.filter(
        user =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
      ) || [],
    [users, searchText]
  );

  const renderUsersList = useCallback(
    () => (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {isLoading ? (
          <ListItem>
            <Box display="flex" justifyContent="center" width="100%">
              <CircularProgress size={24} />
            </Box>
          </ListItem>
        ) : (
          filteredUsers.map(user => {
            const isSelected = selectedUsers.some(u => u.id === user.id);
            return (
              <ListItem
                key={user.id}
                onClick={() => handleUserToggle(user)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: isSelected ? 'action.selected' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <UserElement user={user} />
              </ListItem>
            );
          })
        )}
      </List>
    ),
    [isLoading, filteredUsers, selectedUsers, handleUserToggle]
  );

  useEffect(() => {
    if (containerRef.current) {
      showDropdown(
        renderUsersList(),
        containerRef.current,
        handleDropdownClose
      );
    }
    return () => {
      hideDropdown();
    };
  }, [renderUsersList, showDropdown, hideDropdown, handleDropdownClose]);

  return (
    <Box ref={containerRef}>
      <TextField
        autoFocus
        fullWidth
        size="small"
        variant="outlined"
        value={searchText}
        onChange={e => handleSearchChange(e.target.value)}
        slotProps={{
          input: {
            'aria-label': 'Search users',
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minHeight: '24px', backgroundColor: '#fff' }}
      />
    </Box>
  );
};

export default UserEditor;
