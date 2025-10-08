import React from 'react';
import Layout from '../../../components/common/Layout';
import UserPoints from '../components/UserPoints';
import { useAuth } from '../../../hooks/useAuth';

const PointsPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <UserPoints />
    </Layout>
  );
};

export default PointsPage;