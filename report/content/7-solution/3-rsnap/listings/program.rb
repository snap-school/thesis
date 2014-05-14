# == Schema Information
#
# Table name: programs
#
#  id                       :integer          not null, primary key
#  source_code_file_name    :string(255)
#  source_code_content_type :string(255)
#  source_code_file_size    :integer
#  source_code_updated_at   :datetime
#  created_at               :datetime
#  updated_at               :datetime
#  user_id                  :integer
#  mission_id               :integer
#
# Indexes
#
#  index_programs_on_mission_id  (mission_id)
#  index_programs_on_user_id     (user_id)
#

class Program < ActiveRecord::Base
  include Authority::Abilities
  self.authorizer_name = 'ProgramAuthorizer'

  belongs_to :mission
  belongs_to :user

  delegate :title, :to=>:mission, :prefix=>true
  delegate :name, :to=>:user, :prefix=>true

  has_attached_file :source_code

  validates_attachment :source_code, :presence=>true, :content_type=>{:content_type=>/text/}
  validates :user_id, :mission_id, :presence=>true
  validates_uniqueness_of :mission_id, :scope=>:user_id

  scope :for_mission, ->(mission){where(:mission_id=>mission)}
  scope :for_user, ->(user){where(:user_id=>user)}
  scope :order_by_missions, ->{includes(:mission).order("missions.mission_order ASC")}

  def self.for_mission_for_user(mission, user)
    Program.for_mission(mission).for_user(user).first
  end
end
